import { Global, Module, Provider } from '@nestjs/common';
import { KafkaModule } from './module';
import {
  KafkaPublisherMap,
  KafkaSubscriberMap,
  KAFKA_PUBLISHER_MAP,
  KAFKA_SUBSCRIBER_MAP,
} from '../types';

@Global()
@Module({})
export class KafkaCoreModule {
  static register() {
    const KafkaPublisherMapProvider = this.createKafkaPublisherMapProvider();
    const KafkaSubscriberMapProvider = this.createKafkaSubscriberMapProvider();

    const providerList = [KafkaPublisherMapProvider, KafkaSubscriberMapProvider];
    return {
      module: KafkaModule,
      providers: providerList,
      exports: providerList,
    };
  }

  private static createKafkaPublisherMapProvider(): Provider {
    return {
      provide: KAFKA_PUBLISHER_MAP,
      useFactory: (): KafkaPublisherMap => new Map(),
    };
  }

  private static createKafkaSubscriberMapProvider(): Provider {
    return {
      provide: KAFKA_SUBSCRIBER_MAP,
      useFactory: (): KafkaSubscriberMap => new Map(),
    };
  }
}
