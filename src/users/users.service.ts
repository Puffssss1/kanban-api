import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  findAll() {
    return this.userRepository.findAll();
  }

  findOne(id: string) {
    const user = this.userRepository.findOne(id);
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);
    if (!user) {
      throw new NotFoundException(`user: ${id} not found`);
    }
    const updatedUser = { ...user, ...updateUserDto };

    return this.userRepository.update(id, updatedUser);
  }

  async delete(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`user: ${id} not found`);
    }
    const result = await this.userRepository.delete(id);
    return {
      message: `user: ${id} ` + result.full_name + 'deleted successfully',
    };
  }
}
