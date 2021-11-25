import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('PERMISSION_SERVICE')
    private readonly permissionServiceClient: ClientProxy,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get<string[]>(
      'permission',
      context.getHandler(),
    );

    console.log('PermissionGuard--permission===', permission);

    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const permissionInfo: Record<string, any> = await firstValueFrom(
      this.permissionServiceClient.send('permission_check', {
        permission,
        user: request.user,
      }),
    );

    if (!permissionInfo || permissionInfo.status !== HttpStatus.OK) {
      throw new HttpException(
        { message: permissionInfo.message, data: null, errors: null },
        permissionInfo.status,
      );
    }

    console.log('PermissionGuard--permissionInfo===', permissionInfo);

    return true;
  }
}
