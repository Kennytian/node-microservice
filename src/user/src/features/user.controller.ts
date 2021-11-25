import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { IUser } from '../interfaces/user.interface';
import { IUserCreateResponse } from '../interfaces/user-create-response.interface';
import { user_create, user_get_by_id } from "../constants";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(user_get_by_id)
  public async getUserById(id: string): Promise<any> {
    const user = await this.userService.searchUserById(id);
    return {
      status: HttpStatus.OK,
      message: 'user_get_by_id_success',
      user,
      errors: null,
    };
  }

  @MessagePattern(user_create)
  public async createUser(userParam: IUser): Promise<IUserCreateResponse> {
    const user: IUser = await this.userService.createUser(userParam);
    return {
      status: HttpStatus.CREATED,
      message: 'user create success',
      user,
      errors: null,
    };
  }
}
