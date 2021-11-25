import { IUser } from './user.interface';

export interface IServiceUserGetByIdResponse {
  status: number;
  message: string;
  errors: null;
  user: IUser | null;
}
