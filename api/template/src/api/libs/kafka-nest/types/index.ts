import { KafkaPublisher } from '../module/kafka/kafkaPublisherProviders';
import { KafkaSubscriber } from '../module/kafka/kafkaSubscribersProviders';

export const KAFKA_PUBLISHER_MAP = 'KAFKA_PUBLISHER_MAP ';

export type KafkaPublisherMap = Map<string, KafkaPublisher>;

export const KAFKA_SUBSCRIBER_MAP = 'KAFKA_SUBSCRIBER_MAP ';

export type KafkaSubscriberMap = Map<string, KafkaSubscriber>;

export type PublisherTopic = {
  connection: {
    topicName: string;
    version?: string;
    identifier?: string;
    keepAlive?: boolean;
  };
  name: string;
};

export type SubscriberTopic = {
  connection: {
    topicName: string;
    version?: string;
    identifier?: string;
    maxNumberOfFailures: number;
    maxTimeoutOnFailure?: number;
    deathLetterQueueTopic?: string;
    fromBeginning?: boolean;
  };
  name: string;
};
