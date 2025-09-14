import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BoardsRepository } from './boards.repository';

@Injectable()
export class BoardsService {
  constructor(private boardsRepository: BoardsRepository) {}

  async createBoards(boardName: string, boardOwner: string) {
    const result = await this.boardsRepository.createBoards(
      boardName,
      boardOwner,
    );
    return result;
  }

  async findUser(id: string) {
    const result = await this.boardsRepository.findUserById(id);
    if (result === null) {
      throw new NotFoundException('User not found');
    }
    return result;
  }

  async findUserByEmail(email: string) {
    const result = await this.boardsRepository.findUserByEmail(email);
    if (!result) {
      throw new NotFoundException('Email not found');
    }
    return result;
  }

  async membership(boardId: string, userId: string) {
    const result = await this.boardsRepository.membership(boardId, userId);
    if (!result) {
      throw new ForbiddenException('You are not a member of the board');
    }
    return result;
  }

  findAll() {
    return this.boardsRepository.findAll();
  }

  async findOne(id: string) {
    const result = await this.boardsRepository.findOne(id);
    if (!result) {
      throw new NotFoundException(`board: ${id} not found`);
    }
    return result;
  }

  getBoardsOfUser(authenticatedUser: string) {
    const result = this.boardsRepository.getBoardsOfUser(authenticatedUser);
    if (!result) {
      throw new BadRequestException('User is not Logged in');
    }
    return result;
  }

  async addMembersToBoard(payload: {
    boardId: string;
    email: string;
    role: string;
    inviter: string;
  }) {
    /*
    ! need to adjust validation the owner or a member of the board is the one who will be able to invite
    * adjustment validation status - done
    */
    //check if inviter exist
    const checkUser = await this.findUserByEmail(payload.email);

    // check if the inviter is a member of the board
    const boardMember = await this.membership(payload.boardId, checkUser.id);

    // check if the user is an editor
    if (boardMember.role === 'VIEWER') {
      throw new ForbiddenException('You are not an editor of this board');
    }

    const invitedUser = {
      boardId: payload.boardId,
      userId: checkUser.id,
      role: payload.role,
    };

    return this.boardsRepository.addMembersToBoard(invitedUser);
  }

  async updateRole(
    boardId: string,
    updatedRole: { email: string; role: string },
  ) {
    const checkUser = await this.findUserByEmail(updatedRole.email);

    const newUpdatedData = {
      boardId: boardId,
      userId: checkUser.id,
      newUserRole: updatedRole.role,
    };
    return this.boardsRepository.updateRole(newUpdatedData);
  }

  async remove(id: string) {
    await this.findOne(id);
    const result = this.boardsRepository.remove(id);
    return {
      message: `board: ${id}` + result + 'deleted',
    };
  }
}
