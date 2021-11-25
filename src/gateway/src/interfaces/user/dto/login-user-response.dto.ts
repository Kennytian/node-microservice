import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponseDto {
  @ApiProperty({ example: 'token create success' })
  message: string;

  @ApiProperty({ example: { token: 'some encode token' }, nullable: true })
  data: { token: string };

  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
