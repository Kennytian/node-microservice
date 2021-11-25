import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ uniqueItems: true, example: 'test1@hello.com' })
  email: string;

  @ApiProperty({ minLength: 6, example: 'test1' })
  password: string;
}
