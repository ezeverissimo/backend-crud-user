import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async create(data: UserCreateDto): Promise<any> {
    const result = await this.userRepository.findBy({ email: data.email });

    if (result.length > 0) throw new ConflictException('Email already exists');

    const user = new User();
    user.email = data.email;
    user.name = data.name;
    user.password = data.password;
    user.status = data.status || 'ativo';
    user.updatedAt = data.updatedAt || new Date().toISOString();

    const userCreated = await this.userRepository.save(user);
    return {
      id: userCreated.id,
      name: userCreated.name,
      email: userCreated.email,
      status: userCreated.status,
      updatedAt: userCreated.updatedAt,
    };
  }
}