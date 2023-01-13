import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AlertUserTopicDto } from '../dtos/userAlertTopic.dto';
import { UpdateUserTopicDto } from '../dtos/userUpdateTopic.dto';
import { User, UserDocument } from '../models/user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}
  async updateFromTopic(updateUserDto: UpdateUserTopicDto) {
    const { email } = updateUserDto;
    await this.UserModel.findOneAndUpdate({ email }, updateUserDto);
  }

  async alertUser(alertUserTopicDto: AlertUserTopicDto, id: string) {
    Logger.log(JSON.stringify(alertUserTopicDto));
    Logger.log(id);
    //TODO alert user logic
  }
}
