import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from '../libs/kafka-nest/module/module';

import { KafkaSubscriberService } from './KafkaSubscribers';
import { User, UserSchema } from './models/user.model';
import { UserService } from './services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    KafkaModule.forFeatureSubscriber([
      {
        name: 'USER_UPDATED_TOPIC', // topic alias
        connection: {
          topicName: 'co.arcus.user.updated',
          version: '1',
          identifier: 'IDENTIFIER',
          maxNumberOfFailures: 5,
          fromBeginning: true,
        },
      },
      {
        name: 'USER_ALERT_TOPIC', // topic alias
        connection: {
          topicName: 'co.arcus.user.alert',
          version: '1',
          identifier: 'IDENTIFIER',
          maxNumberOfFailures: 5,
          fromBeginning: true,
        },
      },
    ]),
    KafkaModule.forFeaturePublisher([
      {
        name: 'PUBLISHER_TOPIC_NOTIFY', // topic alias
        connection: {
          topicName: 'co.arcus.user.notify',
          version: '1',
          identifier: 'IDENTIFIER',
        },
      },
    ]),
  ],
  providers: [KafkaSubscriberService, UserService],
})
export class SubscribersModule {}
