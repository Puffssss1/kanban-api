import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersRepository {
  constructor(private dbService: DatabaseService) {}
  // find all users
  async findAll() {
    const data = await this.dbService.users.findMany();
    if (!data) {
      return [];
    }
    return data;
  }

  // find user by id
  async findOne(id: string) {
    try {
      const user = await this.dbService.users.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          email: true,
          full_name: true,
          avatar_url: true,
        },
      });
      if (!user) {
        throw new NotFoundException(`user: ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new NotFoundException(`user: ${id} not found`);
    }
  }

  // edit user by id
  update(
    id: string,
    updatedUser: { full_name?: string; email?: string; password?: string },
  ) {
    return this.dbService.users.update({
      where: { id: id },
      data: {
        full_name: updatedUser.full_name,
        email: updatedUser.email,
      },
    });
  }

  // delete user by id
  delete(id: string) {
    return this.dbService.users.delete({ where: { id: id } });
  }
}
