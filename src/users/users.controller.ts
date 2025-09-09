import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

/*
  TODO: get authenticated users 
  ? status - Done 
  * GET /users/me
    * get the user from the token
  TODO: get user by id  
  ? status - Done 
  * GET /boards/[id]
    * get the user by id
  TODO: Edit users
  ? status - Done 
  * PATCH /user/[id]
    * edit the user using id
  TODO: Edit users
  ? status - Done 
  * DELETE /user/[id]
    * delete existing user
*/

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  findMe(@Req() req: Request) {
    return req.user;
  }

  // GET /user/:id (get user by id)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  //PATCH /user/:id (update user by id)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  //DELETE /user/:id (delete user by id)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
