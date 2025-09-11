import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ColumnRepository {
  constructor(private dbService: DatabaseService) {}

  //findUser by id
  async findUser(id: string) {
    const result = await this.dbService.users.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });
    return result;
  }
  //findBoard by id
  async findBoard(id: string) {
    const result = await this.dbService.boards.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
    return result;
  }

  // Post Crete Column
  async createColumn(columnData: {
    boardId: string;
    userId: string;
    columnTitle: string;
    columnDescription: string;
  }) {
    // check if the user is a member of the board
    const isMember = await this.dbService.board_members.findFirst({
      where: {
        board_id: columnData.boardId,
        user_id: columnData.userId,
      },
    });
    if (!isMember) {
      throw new ForbiddenException('You are not not a member of the board');
    }

    // get the current higheest position
    const lastColumn = await this.dbService.columns.findFirst({
      where: { board_id: columnData.boardId },
      orderBy: { position: 'desc' },
    });
    const nextColumn = lastColumn ? lastColumn.position + 1 : 1;

    // save data
    const result = await this.dbService.columns.create({
      data: {
        column_title: columnData.columnTitle,
        description: columnData.columnDescription,
        position: nextColumn,
        board: {
          connect: {
            id: columnData.boardId,
          },
        },
      },
    });
    return result;
  }

  // boardId
  // userId
  // column
  // Get all the column for a user and include task
  async findAllColumn(boardId: string, userId: string, includeTask: boolean) {
    const result = await this.dbService.columns.findMany({
      where: {
        board_id: boardId,
        board: {
          BoardMembers: {
            some: {
              user_id: userId,
            },
          },
        },
      },
      include: {
        TaskBoxes: includeTask,
      },
    });
    return result;
  }
}
