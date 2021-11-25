import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from './services/config/config.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('API docs')
    .addTag('users')
    .addTag('tasks')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const configSrv = new ConfigService();
  const port = +configSrv.get('port');
  const apiPath = 'api';
  SwaggerModule.setup(apiPath, app, document);
  await app.listen(port);
  Logger.debug(`${configSrv.get('hostname')}:${port}/${apiPath} ${new Date()}`);
}

bootstrap();
