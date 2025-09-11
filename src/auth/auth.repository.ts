import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as argon from 'argon2';

@Injectable()
export class AuthRepository {
  constructor(private readonly dbService: DatabaseService) {}
  async findAll() {
    const data = await this.dbService.users.findMany();
    if (!data) {
      return [];
    }
    return data;
  }

  // find user by email
  async findByEmail(data: string) {
    try {
      const user = await this.dbService.users.findUnique({
        where: {
          email: data,
        },
        select: {
          id: true,
          email: true,
          full_name: true,
        },
      });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      return null;
    }
  }

  async create(data: { email: string; full_name: string; password: string }) {
    const formatedName = data.full_name
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    const newUser = await this.dbService.users.create({
      data: {
        email: data.email,
        full_name: formatedName,
        hashed_password: data.password,
        updated_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        avatar_url: true,
      },
    });
    return newUser;
  }

  async login(loginCreadentials: { email: string; password: string }) {
    // check email if it exist in the database
    const getUser = await this.dbService.users.findUnique({
      where: {
        email: loginCreadentials.email,
      },
      select: {
        id: true,
        full_name: true,
        avatar_url: true,
        email: true,
        hashed_password: true,
      },
    });
    // if user exist verify password
    const passwordMatches = await argon.verify(
      getUser.hashed_password,
      loginCreadentials.password,
    );
    // if password incorrect throw error
    if (!passwordMatches) {
      throw new NotFoundException('Incorrect Password');
    }
    // if password correct
    delete getUser.hashed_password;
    return getUser;
  }
}
