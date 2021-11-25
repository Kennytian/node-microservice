import { Injectable } from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class UserService {
  public async searchUserById(id: string): Promise<any> {
    const userInfo = {
      id,
      email: '1@1.net',
      message: 'search usr by id',
    };
    return Promise.resolve(userInfo);
  }

  public async createUser(user: IUser): Promise<IUser> {
    const { password, ...other } = user;
    const userInfo = {
      id: Date.now(),
      ...other,
    };
    return Promise.resolve(userInfo);
  }
}
