import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {};
    this.envConfig.port = process.env.API_GATEWAY_PORT;
    this.envConfig.hostname = process.env.BASE_URI;

    this.envConfig.tokenService = {
      options: {
        host: process.env.TOKEN_SERVICE_HOST,
        port: process.env.TOKEN_SERVICE_PORT,
      },
      transport: Transport.TCP,
    };

    this.envConfig.userService = {
      options: {
        host: process.env.USER_SERVICE_HOST,
        port: +process.env.USER_SERVICE_PORT,
      },
      transport: Transport.TCP,
    };

    this.envConfig.taskService = {
      options: {
        host: process.env.TASK_SERVICE_HOST,
        port: process.env.TASK_SERVICE_PORT,
      },
      transport: Transport.TCP,
    };

    this.envConfig.permissionService = {
      options: {
        host: process.env.PERMISSION_SERVICE_HOST,
        port: process.env.PERMISSON_SERVICE_PORT,
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
