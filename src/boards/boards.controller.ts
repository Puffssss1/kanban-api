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
  BadRequestException,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto, UpdateBoardDto, AddUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request.interface';

/*
  TODO: create boards 
  ? status - Done 
  * POST /boards/create-boards
    * authenticated user can only create accounts
    * the user will create the boards
    * create the Board_members as well 
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
  TODO: Invite Users to the Board_members
  ? status - done 
  * POST /boards/[id]/invite
    * add or invite a users to the board via email
  TODO: Change Users role in Board_members
  ? status - done 
  * POST /boards/[id]/
    * change the role of a user
  TODO: update board
  ? status - done 
  * PATCH /boards/[id]/update
    * update the board name
  TODO: delete board
  ? status - done 
  * DELETE /boards/[id]/delete
    * Delete Module
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
  getBoardsOfUser(@Req() req: AuthenticatedRequest) {
    const authenticatedUser = req.user.id;
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
    @Req() req: AuthenticatedRequest,
  ) {
    const boardName = createBoardDto.board_name;
    const boardOwner = req.user.id;
    return this.boardsService.createBoards(boardName, boardOwner);
  }

  // POST /boards/:boardId/invite
  @Post(':boardId/invite')
  addUsersToTheBoard(
    @Param('boardId') boardId: string,
    @Body() addUserDto: AddUserDto,
    @Req() req: AuthenticatedRequest,
  ) {
    //the user cant ad it self
    if (addUserDto.email === req.user.email) {
      throw new BadRequestException('You cannot add your self');
    }
    const payload = {
      boardId,
      inviter: req.user.id,
      email: addUserDto.email,
      role: addUserDto.role,
    };
    return this.boardsService.addMembersToBoard(payload);
  }

  //PATCH /boards/:boardId/update
  @Patch(':id/update')
  updateRole(
    @Param('id') boardId: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    const updatedRole = {
      email: updateBoardDto.email,
      role: updateBoardDto.role,
    };
    return this.boardsService.updateRole(boardId, updatedRole);
  }

  // DELETE /boards/:boardId/delete
  @Delete(':id/delete')
  remove(@Param('id') id: string) {
    return this.boardsService.remove(id);
  }
}
