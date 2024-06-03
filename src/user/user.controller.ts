import { Controller, Get, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiTags('Register')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Create new User' })
  @ApiBody({ type: UserDto })
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: UserDto) {
    return this.userService.create(createUserDto);
  }
}
