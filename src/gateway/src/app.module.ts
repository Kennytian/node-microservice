import { Module } from '@nestjs/common';
import { UserController } from './features/user.controller';
import { TaskController } from './features/task.controller';
import { ConfigService } from './services/config/config.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './services/guards/authorization.guard';
import {
  PERMISSION_SERVICE,
  TASK_SERVICE,
  TOKEN_SERVICE,
  USER_SERVICE, taskService,
  tokenService,
  userService
} from "@project/constants";

@Module({
  imports: [],
  controllers: [UserController, TaskController],
  providers: [
    ConfigService,
    {
      provide: TOKEN_SERVICE,
      useFactory: (configService: ConfigService) => {
        const tokenServiceOptions = configService.get(tokenService);
        return ClientProxyFactory.create(tokenServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: USER_SERVICE,
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get(userService);
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: TASK_SERVICE,
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create(configService.get(taskService)),
      inject: [ConfigService],
    },
    {
      provide: PERMISSION_SERVICE,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(
          configService.get('permissionService'),
        );
      },
      inject: [ConfigService],
    },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
