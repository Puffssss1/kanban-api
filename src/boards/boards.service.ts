import { Injectable } from '@nestjs/common';
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

  findAll() {
    return this.boardsRepository.findAll();
  }

  findOne(id: string) {
    return this.boardsRepository.findOne(id);
  }

  getBoardsOfUser(authenticatedUser: string) {
    return this.boardsRepository.getBoardsOfUser(authenticatedUser);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
