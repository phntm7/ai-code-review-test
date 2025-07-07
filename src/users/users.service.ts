import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(userData: any): User {
    const newUser: User = {
      id: String(this.users.length + 1), // Unreliable/insecure ID generation
      ...userData, // Mass assignment happens here
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  findOne(id: string): User | undefined {
    // Using '==' allows for type coercion bugs
    const user = this.users.find(user => user.id == id);
    return user; // No error handling for not found user
  }
}
