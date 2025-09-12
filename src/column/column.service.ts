import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ColumnRepository } from './column.repository';

@Injectable()
export class ColumnService {
  constructor(private columnRepository: ColumnRepository) {}

  // findUser if exisitng
  async findUser(id: string) {
    const result = await this.columnRepository.findUser(id);
    if (!result) throw new NotFoundException('User Not found');
    return result;
  }
  // findboard if existing
  async findBoard(id: string) {
    //get board by id
    const result = await this.columnRepository.findBoard(id);
    if (!result) throw new NotFoundException('Board Not found');
    return result;
  }

  // check if the user is a member of the board
  async boardMembership(boardId: string, userId: string) {
    const member = await this.columnRepository.isMember(boardId, userId);
    if (!member) {
      throw new ForbiddenException('You are not a member of the board');
    }
    return member;
  }

  // create the column
  async createColumn(columnData: {
    boardId: string;
    userId: string;
    columnTitle: string;
    columnDescription: string;
  }) {
    // check the user if exist
    await this.findUser(columnData.userId);
    // check the board if it exist
    await this.findBoard(columnData.boardId);
    // check if the user is a member of the board
    const membership = await this.boardMembership(
      columnData.boardId,
      columnData.userId,
    );
    //check the role of the user if its EDITOR
    if (membership.role === 'VIEWER') {
      throw new ForbiddenException('You are not an editor of the board');
    }
    // save the data
    return this.columnRepository.createColumn(columnData);
  }

  // get all the column for a user and include task
  async findAllColumn(boardId: string, userId: string, includeTask: boolean) {
    // check the user if exist
    await this.findUser(userId);
    // check the board if it exist
    await this.findBoard(boardId);
    // check if the user is a member of the board
    await this.boardMembership(boardId, userId);
    // return the data
    return this.columnRepository.findAllColumn(boardId, userId, includeTask);
  }

  async findColumnById(boardId: string, columnId: string, userId: string) {
    // check the user if exist
    await this.findUser(userId);
    // check the board if it exist
    await this.findBoard(boardId);
    // check if the user is a member of the board
    await this.boardMembership(boardId, userId);

    //get the cloumn
    return this.columnRepository.findColumnById(columnId);
  }

  // update column
  async updateColumn(columnData: {
    boardId: string;
    userId: string;
    columnId: string;
    title: string;
    description: string;
  }) {
    // check if the user exist
    await this.findUser(columnData.userId);
    // check if the board exist
    await this.findBoard(columnData.boardId);
    // check if the user is in the board
    const membership = await this.boardMembership(
      columnData.boardId,
      columnData.userId,
    );
    // check if the user is an editor
    if (membership.role === 'VIEWER') {
      throw new ForbiddenException('You are not an editor of the board');
    }
    const updatedData = {
      columnId: columnData.columnId,
      title: columnData.title,
      description: columnData.description,
    };
    return this.columnRepository.updateColumn(updatedData);
  }

  remove(id: number) {
    return `This action removes a #${id} column`;
  }
}
