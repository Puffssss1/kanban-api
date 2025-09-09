import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBoardDto } from './dto/update-board.dto';
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
