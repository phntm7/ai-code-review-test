import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(UsersController.name);

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
