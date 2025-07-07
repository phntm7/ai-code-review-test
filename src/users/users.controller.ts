import { Controller, Get, Post, Body, Param, Logger, Query, Res } from '@nestjs/common';
import { Response } from 'express';
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
    @Get('search/results') // Route path is intentionally weird
    search(@Query('q') query: string, @Res() res: Response) {
      const results = this.usersService.search(query);
      // Reflected XSS vulnerability by not escaping the query.
      // Also bypassing NestJS response handling by using the raw Express response object.
      res.setHeader('Content-Type', 'text/html');
      res.send(`<h1>Search Results</h1><p>Found ${results.length} for query: ${query}</p>`);
    }
  }
}
