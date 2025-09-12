import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto';
import { AuthRepository } from './auth.repository';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async findByEmail(data: string) {
    const result = await this.authRepository.findByEmail(data);
    return result;
  }

  async generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });

    return { access_token, refresh_token };
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

    const result = await this.authRepository.create(userDetails);

    return result;
  }

  async login(loginCreadentials: { email: string; password: string }) {
    //get user by email
    await this.findByEmail(loginCreadentials.email);
    const result = await this.authRepository.login(loginCreadentials);
    // return JWTtoken
    const token = await this.generateToken(result.id, result.email);
    return token;
  }

  async refresh(refresh_token: string) {
    // get the exisiting token
    const payload = await this.jwtService.verifyAsync(refresh_token, {
      secret: process.env.JWT_SECRET,
    });

    // verfiy user and token
    const user = await this.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('user do not exist');
    }
    //generate new token
    const newAccessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      },
    );
    //return new token
    return newAccessToken;
  }
}
