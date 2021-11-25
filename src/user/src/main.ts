import { NestFactory } from '@nestjs/core';
import { UserModule } from './features/user.module';
import { TcpOptions } from '@nestjs/microservices';
import { ConfigService } from './services/config.service';
import { userService } from "./constants";

async function bootstrap() {
  const options = new ConfigService().get(userService) as TcpOptions;
  const app = await NestFactory.createMicroservice(UserModule, options);
  await app.listen();
}
bootstrap();
