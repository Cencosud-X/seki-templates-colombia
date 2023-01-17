import { DynamicModule, Global, Inject, Module } from '@nestjs/common';
import { KafkaPublisherMap, KAFKA_PUBLISHER_MAP, PublisherTopic } from '../../types';
import { map } from 'lodash';
import { Publisher } from '@team_seki/kafka-streamer-plugin';

export const InjectKafkaPublisher = (name: string) => Inject(getKafkaToken(name));

const getKafkaToken = (token: string) => `KAFKA-PUBLISHER-${token}`;

@Global()
@Module({})
export class KafkaPublisherFeatureModule {
  static register(topics: PublisherTopic[]): DynamicModule {
    const providers = this.setKafkaProviders(topics);
    return {
      module: KafkaPublisherFeatureModule,
      providers,
      exports: providers,
    };
  }

  private static setKafkaProviders(topics: PublisherTopic[]) {
    return map(topics, (topic) => {
      return {
        provide: getKafkaToken(topic.name),
        useFactory: (kafkaMap: KafkaPublisherMap) => {
          const provider = kafkaMap.get(topic.name);
          if (!provider) {
            const newProvider = new KafkaPublisher(topic.connection);
            kafkaMap.set(topic.name, newProvider);
            return newProvider;
          }
          return provider;
        },
        inject: [KAFKA_PUBLISHER_MAP],
      };
    });
  }
}

export class KafkaPublisher extends Publisher {
  constructor(connection: PublisherTopic['connection']) {
    const { topicName, version, identifier, keepAlive } = connection;
    super({
      topic: `${topicName}${version ? `.v${version}` : ''}`,
      identifier,
      keepAlive,
    });
  }
}
