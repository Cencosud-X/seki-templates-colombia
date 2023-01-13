import { DynamicModule, Global, Module } from '@nestjs/common';
import { KafkaPublisherFeatureModule } from './kafka/kafkaPublisherProviders';
import { KafkaCoreModule } from './coreModule';
import { PublisherTopic, SubscriberTopic } from '../types';
import { KafkaSubscriberFeatureModule } from './kafka/kafkaSubscribersProviders';

@Global()
@Module({})
export class KafkaModule {
  static forRoot(): DynamicModule {
    return {
      module: KafkaModule,
      imports: [KafkaCoreModule.register()],
    };
  }

  static forFeaturePublisher(topics: PublisherTopic[]): DynamicModule {
    return {
      module: KafkaModule,
      imports: [KafkaPublisherFeatureModule.register(topics)],
    };
  }

  static forFeatureSubscriber(topics: SubscriberTopic[]): DynamicModule {
    return {
      module: KafkaModule,
      imports: [KafkaSubscriberFeatureModule.register(topics)],
    };
  }
}
