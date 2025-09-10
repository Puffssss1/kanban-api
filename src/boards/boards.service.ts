import { Injectable, NotFoundException } from '@nestjs/common';
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
  findUserByEmail(email: string) {
    return this.boardsRepository.findUserByEmail(email);
  }

  findAll() {
    return this.boardsRepository.findAll();
  }

  findOne(id: string) {
    return this.boardsRepository.findOne(id);
  }

  getBoardsOfUser(authenticatedUser: string) {
    return this.boardsRepository.getBoardsOfUser(authenticatedUser);
  }

  async addMembersToBoard(payload: {
    boardId: string;
    email: string;
    role: string;
    inviter: string;
  }) {
    //check if inviter exist
    const checkUser = await this.findUserByEmail(payload.email);
    if (checkUser === null) {
      throw new NotFoundException('User not found');
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
    if (checkUser === null) {
      throw new NotFoundException('User not found');
    }
    const checkBoard = await this.findOne(boardId);
    if (checkBoard === null) {
      throw new NotFoundException('Board not found');
    }
    const newUpdatedData = {
      boardId: boardId,
      userId: checkUser.id,
      newUserRole: updatedRole.role,
    };
    return this.boardsRepository.updateRole(newUpdatedData);
  }

  remove(id: string) {
    const checkBoard = this.findOne(id);
    if (!checkBoard) {
      throw new NotFoundException('Board Not Found');
    }
    return this.boardsRepository.remove(id);
  }
}
