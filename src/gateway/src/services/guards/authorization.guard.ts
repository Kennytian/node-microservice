import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable, Logger
} from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { TOKEN_SERVICE, USER_SERVICE, user_get_by_id } from "../../constants";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(TOKEN_SERVICE) private readonly tokenServiceClient: ClientProxy,
    @Inject(USER_SERVICE) private readonly userServiceClient: ClientProxy,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<string[]>(
      'secured',
      context.getHandler(),
    );

    Logger.debug('AuthGuard--secured===', secured);

    if (!secured) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userTokenInfo: Record<string, any> = await firstValueFrom(
      this.tokenServiceClient.send('token_decode', {
        token: request.headers.authorization,
      }),
    );

    if (!userTokenInfo || !userTokenInfo.data) {
      throw new HttpException(
        {
          message: userTokenInfo.message,
          data: null,
          errors: null,
        },
        userTokenInfo.status,
      );
    }

    const userInfo: Record<string, any> = await firstValueFrom(
      this.userServiceClient.send(user_get_by_id, userTokenInfo.data.userId),
    );
    request.user = userInfo.user;

    Logger.debug('AuthGuard--userInfo===', userInfo);

    return true;
  }
}
