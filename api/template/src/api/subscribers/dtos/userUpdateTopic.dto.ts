import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserTopicDto {
  @IsString()
  readonly name!: string;

  @IsEmail()
  readonly email!: string;

  @IsOptional()
  readonly address?: string;
}
