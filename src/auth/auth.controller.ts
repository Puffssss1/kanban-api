import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, AuthDto } from './dto';

/* 
todo: POST /auth/register create new user
todo: POST /auth/login login user(return JWT)
todo: POST /auth/google (OAuth integration)
*/

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() SignupDto: SignupDto) {
    return this.authService.create(SignupDto);
  }

  @Post('login')
  login(@Body() AuthDto: AuthDto) {
    const loginCreadentials = {
      email: AuthDto.email,
      password: AuthDto.password,
    };
    return this.authService.login(loginCreadentials);
  }
}
