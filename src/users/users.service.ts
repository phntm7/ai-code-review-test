import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { connectToLegacySystem } from '../config';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: randomUUID(),
      name: createUserDto.name,
      email: createUserDto.email,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  findOne(id: string): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
    search(query: string): User[] {
      connectToLegacySystem(); // Calling the performance-blocking function

      if (!query) return [];

      // Inefficient regex, can be subject to ReDoS
      const regex = new RegExp(`.*${query}.*`, 'i');
      return this.users.filter(user => regex.test(user.name) || regex.test(user.email));
    }
  }
}
