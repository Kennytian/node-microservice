import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../user.interface';
import { HttpStatus } from "@nestjs/common";

export class GetUserByIdResponseDto {
  @ApiProperty({ example: 'user_get_by_id_success' })
  message: string;

  @ApiProperty({
    example: {
      user: {
        email: 'test@hello.com',
        is_confirmed: true,
        id: '5d987c3bfb881ec86b476bcc',
      },
    },
    nullable: true,
  })
  data: {
    user: IUser;
  };

  @ApiProperty({ example: HttpStatus.OK })
  status:number;

  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
