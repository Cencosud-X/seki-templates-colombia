import { IsEmail, IsNotEmpty } from 'class-validator';

export class AlertUserTopicDto {
  @IsEmail()
  readonly email!: string;

  @IsNotEmpty()
  readonly message!: string;
}
