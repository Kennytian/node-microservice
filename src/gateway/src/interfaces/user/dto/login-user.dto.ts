import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ nullable: false, example: 'test@hello.com' })
  email: string;

  @ApiProperty({ nullable: false, example: 'test111' })
  password: string;
}
