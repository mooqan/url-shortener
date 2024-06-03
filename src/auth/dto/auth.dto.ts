import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {
    @ApiProperty({
        type: 'string',
        example: 'test@gmail.com'
    })
    email: string;

    @ApiProperty({
        type: 'string',
        example: '123456'
    })
    password: string;
}
