import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, AuthDto } from './dto';

/* 
  TODO: create new user
  ? status - done 
  * POST /auth/register 
    * register new users
  TODO: login user
  ? status - done 
  * POST /auth/login
    * validate users creadentials and return JWT token
  TODO: OAuth integration
  ? status - ongoing (on hold)
  * POST /auth/google
    * login user using google or other providers if possible
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

  @Post('refresh')
  refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refresh(body.refresh_token);
  }
}
