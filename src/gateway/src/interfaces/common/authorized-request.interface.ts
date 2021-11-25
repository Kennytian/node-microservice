import { IUser } from '../user/user.interface';

export interface IAuthorizedRequest {
  user?: IUser;
}
