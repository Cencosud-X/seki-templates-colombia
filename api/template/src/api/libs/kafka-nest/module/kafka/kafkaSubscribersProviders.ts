import { DynamicModule, Global, Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { KafkaSubscriberMap, KAFKA_SUBSCRIBER_MAP, SubscriberTopic } from '../../types';
import { map } from 'lodash';
import { IHandler } from '@team_seki/kafka-streamer-plugin';
import {
  DiscoveredMethodWithMeta,
  DiscoveryModule,
  DiscoveryService,
} from '@nestjs-plus/discovery';
import { kafkaRefelctKey } from '../../decorators';

const getKafkaToken = (token: string) => `KAFKA-SUBSCRIBER-${token}`;

@Global()
@Module({
  imports: [DiscoveryModule],
})
export class KafkaSubscriberFeatureModule implements OnModuleInit {
  constructor(
    private readonly discover: DiscoveryService,
    @Inject(KAFKA_SUBSCRIBER_MAP)
    private readonly kafkaSubscriberMap: KafkaSubscriberMap
  ) {}
  public async onModuleInit() {
    const providers: DiscoveredMethodWithMeta<{ providerName: string }>[] =
      await this.discover.providerMethodsWithMetaAtKey(kafkaRefelctKey);

    for (const provider of providers) {
      const {
        meta: { providerName },
        discoveredMethod,
      } = provider;

      const subscriber = this.kafkaSubscriberMap.get(providerName);

      if (subscriber) {
        subscriber.handleMessage = async (...args) => {
          return await discoveredMethod.handler.apply(discoveredMethod.parentClass.instance, args);
        };
        await subscriber.boot();
        Logger.log(`Kafka subscriber for topic ${subscriber.props.topic} listening`, name);
      }
    }
    Logger.log('All Kafka subscribers listening', 'KafkaSubscribers');
  }

  static register(topics: SubscriberTopic[]): DynamicModule {
    const providers = this.setKafkaProviders(topics);
    return {
      module: KafkaSubscriberFeatureModule,
      providers,
      exports: providers,
    };
  }

  private static setKafkaProviders(topics: SubscriberTopic[]) {
    return map(topics, (topic) => {
      return {
        provide: getKafkaToken(topic.name),
        useFactory: (kafkaMap: KafkaSubscriberMap) => {
          const provider = kafkaMap.get(topic.name);
          if (!provider) {
            const newProvider = new KafkaSubscriber(topic);

            kafkaMap.set(topic.name, newProvider);
            return newProvider;
          }
          return provider;
        },
        inject: [KAFKA_SUBSCRIBER_MAP],
      };
    });
  }
}

export class KafkaSubscriber extends IHandler {
  constructor(topic: SubscriberTopic) {
    const { topicName, version, ...rest } = topic.connection;
    super({
      topic: `${topicName}${version ? `.v${version}` : ''}`,
      artifactName: topic.name.toLowerCase(),
      ...rest,
    });
  }
}
