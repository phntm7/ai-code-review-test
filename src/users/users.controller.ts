import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto'; // DTO is no longer used

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(UsersController.name);

  @Post()
  create(@Body() userData: any) { // Bypassing DTO validation by using `any`
    this.logger.log(`Creating user with data: ${JSON.stringify(userData)}`); // Sensitive data in logs
    return this.usersService.create(userData);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
