import { Injectable } from '@nestjs/common';
import {
  HandleMessage,
  InjectKafkaPublisher,
  KafkaHeaders,
  KafkaPublisher,
  MessageBody,
  MessageHeaders,
} from '../libs/kafka-nest';
import { AlertUserTopicDto } from './dtos/userAlertTopic.dto';
import { UpdateUserTopicDto } from './dtos/userUpdateTopic.dto';
import { UserService } from './services/user.service';

@Injectable()
export class KafkaSubscriberService {
  constructor(
    @InjectKafkaPublisher('PUBLISHER_TOPIC_NOTIFY')
    private readonly UserNotifyPublisher: KafkaPublisher, // dependency injection for publishers
    private readonly userService: UserService
  ) {}

  @HandleMessage('USER_UPDATED_TOPIC') // method decorator for subscriber
  async handleUserUpdate(@MessageBody() userUpdateTopicDto: UpdateUserTopicDto) {
    await this.userService.updateFromTopic(userUpdateTopicDto);
  }

  @HandleMessage('USER_ALERT_TOPIC')
  async handleUserAlert(
    @MessageBody() alertUserTopicDto: AlertUserTopicDto, // automatic DTO validation
    @MessageHeaders() headers: KafkaHeaders // header decorator
  ) {
    await this.userService.alertUser(alertUserTopicDto, headers.id);
    await this.UserNotifyPublisher.publish(
      { email: alertUserTopicDto.email, notify_date: new Date() },
      {}
    );
  }
}
