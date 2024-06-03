import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl } from "class-validator";

export class CreateUrlDto {
    @ApiProperty({ description: 'The original URL to be shortened', example: 'https://example.com' })
    @IsNotEmpty({ message: 'URL cannot be empty' })
    @IsUrl({}, { message: 'Invalid URL' })
    originalUrl: string;

    @ApiProperty({ description: 'A short title for the URL', example: 'My Example' })
    title: string;
}
