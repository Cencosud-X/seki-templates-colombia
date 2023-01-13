import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HealthModule } from './health/Module';
import { KafkaModule } from './libs/kafka-nest';
import { SubscribersModule } from './subscribers/Module';

@Module({
  imports: [
    HealthModule,
    MongooseModule.forRoot('DB:URI', { dbName: 'DB:NAME' }),
    KafkaModule.forRoot(),
    SubscribersModule,
  ],
})
export class ApiModule {}
