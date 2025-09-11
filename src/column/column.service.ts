import { Injectable, NotFoundException } from '@nestjs/common';
import { ColumnRepository } from './column.repository';

@Injectable()
export class ColumnService {
  constructor(private columnRepository: ColumnRepository) {}

  // findUser if exisitng
  findUser(id: string) {
    const result = this.columnRepository.findUser(id);
    if (!result) {
      throw new NotFoundException('There is no User found');
    }
    return result;
  }
  // findboard if existing
  findBoard(id: string) {
    //get board by id
    const result = this.columnRepository.findBoard(id);
    if (!result) {
      throw new NotFoundException('There is no Board found');
    }
    return result;
  }

  createColumn(columnData: {
    boardId: string;
    userId: string;
    columnTitle: string;
    columnDescription: string;
  }) {
    // check the user if exist
    this.findUser(columnData.userId);
    // check the board if it exist
    this.findBoard(columnData.boardId);
    // save the data
    return this.columnRepository.createColumn(columnData);
  }

  // get all the column for a user and include task
  async findAllColumn(boardId: string, userId: string, includeTask: boolean) {
    // check the user if it is existing
    await this.findUser(userId);
    //check board if it is existing
    await this.findBoard(boardId);

    // return the data
    return this.columnRepository.findAllColumn(boardId, userId, includeTask);
  }

  findOne(id: number) {
    return `This action returns a #${id} column`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number) {
    return `This action updates a #${id} column`;
  }

  remove(id: number) {
    return `This action removes a #${id} column`;
  }
}
