import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../user.interface';
import { HttpStatus } from '@nestjs/common';

export class CreateUserResponseDto {
  @ApiProperty({ example: 'user_create_success' })
  message: string;

  @ApiProperty({
    example: {
      user: {
        email: 'test@hello.com',
        is_confirmed: false,
        id: 'f3a34er34sr234234df',
      },
      token: 'some encode token',
    },
    nullable: true,
  })
  data: {
    user: IUser;
    token: string;
  };

  @ApiProperty({ example: HttpStatus.CREATED })
  status: number;

  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
