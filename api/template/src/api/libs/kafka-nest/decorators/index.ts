import { SetMetadata } from '@nestjs/common';
import { flatMap, forEach, values } from 'lodash';
import 'reflect-metadata';

import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { IMessage } from '@team_seki/kafka-streamer-plugin';

/* eslint-disable  @typescript-eslint/no-explicit-any */

export const kafkaRefelctKey = 'KAFKA_SUBSCRIBER';

const messageBodyDecoratorKey = 'KAFKA_BODY_DECORATOR';
const messageHeaderDecoratorKey = 'KAFKA_HEADER_DECORATOR';

type metaDataValidator = { validatorClass: any; index: number };

export const HandleMessage = (name: string): MethodDecorator => {
  return (target, propertyKey, descriptor: PropertyDescriptor): void => {
    const method = descriptor.value;

    // override method with class validation and header param decorators
    descriptor.value = function (...args: any[]) {
      const { body, headers } = args[0] || {};

      const messageBodyParameters: metaDataValidator[] = Reflect.getOwnMetadata(
        messageBodyDecoratorKey,
        target,
        propertyKey
      );

      if (messageBodyParameters) {
        forEach(messageBodyParameters, ({ index, validatorClass }) => {
          const classValidatorInstance = plainToInstance(validatorClass, body);
          const errors = validateSync(classValidatorInstance);
          if (errors.length > 0) throw flatMap(errors, (error) => values(error.constraints));
          args[index] = classValidatorInstance;
        });
      }

      const messageHeaderParameters: number[] = Reflect.getOwnMetadata(
        messageHeaderDecoratorKey,
        target,
        propertyKey
      );

      if (messageHeaderParameters) {
        forEach(messageHeaderParameters, (index) => {
          args[index] = headers;
        });
      }

      return method?.apply(this, args);
    };

    // anotate for kafka subscriber dependency injection
    SetMetadata(kafkaRefelctKey, {
      name,
      methodName: propertyKey,
    })(target, propertyKey, descriptor);
  };
};

export const MessageBody = (): ParameterDecorator => (target, propertyKey, parameterIndex) => {
  const existingParameters: metaDataValidator[] =
    Reflect.getOwnMetadata(messageBodyDecoratorKey, target, propertyKey) || [];

  const classType = Reflect.getMetadata('design:paramtypes', target, propertyKey);

  existingParameters.push({ validatorClass: classType[0], index: parameterIndex });

  Reflect.defineMetadata(messageBodyDecoratorKey, existingParameters, target, propertyKey);
};

export type KafkaHeaders = IMessage['headers'];

export const MessageHeaders = (): ParameterDecorator => (target, propertyKey, parameterIndex) => {
  const existingParameters: number[] =
    Reflect.getOwnMetadata(messageHeaderDecoratorKey, target, propertyKey) || [];

  existingParameters.push(parameterIndex);

  Reflect.defineMetadata(messageHeaderDecoratorKey, existingParameters, target, propertyKey);
};
