import { IProps as SubscriberIProps } from '@team_seki/kafka-streamer-plugin/src/core/IHandler';
import { IProps as PublisherIProps } from '@team_seki/kafka-streamer-plugin/src/core/Publisher';
import { KafkaPublisher } from '../module/kafka/kafkaPublisherProviders';
import { KafkaSubscriber } from '../module/kafka/kafkaSubscribersProviders';

export const KAFKA_PUBLISHER_MAP = 'KAFKA_PUBLISHER_MAP ';

export type KafkaPublisherMap = Map<string, KafkaPublisher>;

export const KAFKA_SUBSCRIBER_MAP = 'KAFKA_SUBSCRIBER_MAP ';

export type KafkaSubscriberMap = Map<string, KafkaSubscriber>;

export type PublisherTopic = {
  connection: { topicName: string; version?: string } & Omit<PublisherIProps, 'topic'>;
  name: string;
};

export type SubscriberTopic = {
  connection: { topicName: string; version?: string } & Omit<
    SubscriberIProps,
    'artifactName' | 'topic'
  >;
  name: string;
};
