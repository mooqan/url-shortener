import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";

export class UserDto {
    @ApiProperty({
        type: 'string',
        example: 'test@gmail.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        type: 'string',
        example: '123456'
    })
    @MinLength(6, { message: 'Password must be more than 6 symbols' })
    password: string;
}
