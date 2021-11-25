import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { ConfigService } from '../services/config.service';

@Module({
  controllers: [UserController],
  providers: [ConfigService, UserService],
})
export class UserModule {}
