import { ApiProperty } from '@nestjs/swagger';

export class LogoutUserResponseDto {
  @ApiProperty({ example: 'token destroy success' })
  message: string;

  @ApiProperty({ nullable: true, type: 'null', example: null })
  data: null;

  @ApiProperty({ nullable: true, example: null })
  errors: { [key: string]: any };
}
