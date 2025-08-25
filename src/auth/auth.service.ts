import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignupDto } from './dto';
import { AuthRepository } from './auth.repository';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
  findAll() {
    return `This action returns all auth`;
  }

  findByEmail(data: string) {
    return this.authRepository.findByEmail(data);
  }

  async create(SignupDto: SignupDto) {
    //check if the email already exist
    const user = await this.findByEmail(SignupDto.email);

    // if exist throw error
    if (user) {
      throw new BadRequestException('Email already taken');
    }
    //hash the password user argon2
    const hashedPassword = await argon.hash(SignupDto.password);

    //store the user in the database
    const userDetails = {
      email: SignupDto.email,
      full_name: SignupDto.full_name,
      password: hashedPassword,
    };

    return this.authRepository.create(userDetails);
  }

  async login(loginCreadentials: { email: string; password: string }) {
    //get user by email
    const user = await this.findByEmail(loginCreadentials.email);
    // if user not exist throw no user found
    if (!user) {
      throw new NotFoundException('Account not found');
    }
    const result = await this.authRepository.login(loginCreadentials);
    // return JWTtoken
    return result;
  }
}
