import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

/*
  TODO: create boards 
  ? status - Done 
  * POST /boards/create-boards
    * authenticated user can only create accounts
    * the user will create the boards
    ! create the Board_members as well
  TODO: get all boards 
  ? status - done 
  * GET /boards/get-boards
    * get all the boards 
  TODO: get specific board 
  ? status - done 
  * GET /boards/[id]
    * get the by id
  TODO: get boards of the authenticated user 
  ? status - done 
  * GET /boards/owned
    * get the boards of the of the user both owned 
  TODO: get user's board both owned and joined (might be from Board_members)
  ? status - ongoing 
  * GET /boards/users
    * get the boards both joined and owned by the users
  TODO: Invite Users to the Board_members
  ? status - ongoing 
  * POST /boards/invite
    * add or invite a users to the board via email
*/

@UseGuards(AuthGuard('jwt'))
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}
  //Get all boards
  //GET /boards/get-boards
  @Get('get-boards')
  findAll() {
    return this.boardsService.findAll();
  }

  // Get boards of the users
  // GET /boards/owned
  @Get('owned')
  getBoardsOfUser(@Req() req: Request) {
    const authenticatedUser = (req.user as any).id;
    console.log(authenticatedUser);
    return this.boardsService.getBoardsOfUser(authenticatedUser);
  }

  //Get boards by id
  //GET /boards/get-boards/[id]
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardsService.findOne(id);
  }

  // POST /boards/create-boards
  @Post('create-boards')
  async createBoards(
    @Body() createBoardDto: CreateBoardDto,
    @Req() req: Request,
  ) {
    const boardName = createBoardDto.board_name;
    const boardOwner = await (req.user as any).id;
    return this.boardsService.createBoards(boardName, boardOwner);
  }

  // POST /boards/invite
  // id if it should be here tho

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardsService.update(+id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardsService.remove(+id);
  }
}
