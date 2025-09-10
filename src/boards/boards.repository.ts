import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Role } from './enums';

@Injectable()
export class BoardsRepository {
  constructor(private dbService: DatabaseService) {}

  //find user by id
  async findUserById(id: string) {
    const user = await this.dbService.users.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async findUserByEmail(email: string) {
    const result = await this.dbService.users.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
      },
    });
    if (!result) {
      return null;
    }
    return result;
  }

  // Get all boards
  findAll() {
    return this.dbService.boards.findMany({ include: { BoardMembers: true } });
  }

  //create boards
  async createBoards(boardName: string, boardOwner: string) {
    //check if the user exist
    const checkUserID = await this.findUserById(boardOwner);
    if (checkUserID === null) {
      throw new NotFoundException('There is no User');
    }

    // create the board
    const board = await this.dbService.boards.create({
      data: {
        owner_id: boardOwner,
        board_name: boardName,
        updated_at: new Date(),
        // create the board_members
        BoardMembers: {
          create: {
            user_id: boardOwner,
            role: 'EDITOR',
          },
        },
      },
      include: { BoardMembers: true },
    });
    return board;
  }

  // get boards by id
  async findOne(id: string) {
    const result = await this.dbService.boards.findUnique({
      where: {
        id: id,
      },
      include: { BoardMembers: true },
    });
    if (!result) {
      throw new NotFoundException(`board: ${id} not found`);
    }
    return result;
  }

  //get the created boards of a user
  async getBoardsOfUser(authenticatedUser: string) {
    const result = await this.dbService.boards.findMany({
      where: {
        owner_id: authenticatedUser,
      },
      include: { BoardMembers: true },
    });
    if (!result) {
      throw new BadRequestException('User is not Logged in');
    }
    return result;
  }

  //add the user to the board
  async addMembersToBoard(invitedUser: {
    boardId: string;
    userId: string;
    role: string;
  }) {
    // update board_member
    const result = await this.dbService.board_members.upsert({
      where: {
        board_id_user_id: {
          board_id: invitedUser.boardId,
          user_id: invitedUser.userId,
        },
      },
      update: {
        role: invitedUser.role as Role,
      },
      create: {
        board_id: invitedUser.boardId,
        user_id: invitedUser.userId,
        role: invitedUser.role as Role,
      },
    });
    return result;
  }

  async updateRole(newUpdatedData: {
    boardId: string;
    userId: string;
    newUserRole: string;
  }) {
    const checkBoardIdAndUserId = await this.dbService.board_members.findUnique(
      {
        where: {
          board_id_user_id: {
            board_id: newUpdatedData.boardId,
            user_id: newUpdatedData.userId,
          },
        },
      },
    );

    //check if the user and board is exisitgn
    if (!checkBoardIdAndUserId) {
      throw new NotFoundException('The board or User might not exist');
    }

    //check if the user already have the role
    if (checkBoardIdAndUserId.role === newUpdatedData.newUserRole) {
      throw new NotAcceptableException(
        `The role is already set to ${newUpdatedData.newUserRole}`,
      );
    }

    //save the updated role
    const result = this.dbService.board_members.update({
      where: {
        board_id_user_id: {
          board_id: newUpdatedData.boardId,
          user_id: newUpdatedData.userId,
        },
      },
      data: {
        role: newUpdatedData.newUserRole as Role,
      },
    });
    return result;
  }

  async remove(id: string) {
    const result = await this.dbService.boards.delete({
      where: {
        id: id,
      },
    });
    return result;
  }
}
