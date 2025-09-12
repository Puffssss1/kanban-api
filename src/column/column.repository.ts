import { Injectable } from '@nestjs/common';
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

  // ismember
  async isMember(boardId: string, userId: string) {
    const result = await this.dbService.board_members.findFirst({
      where: {
        board_id: boardId,
        user_id: userId,
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
    return { message: 'you have created', result };
  }

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

  async findColumnById(columnId: string) {
    const result = this.dbService.columns.findUnique({
      where: { id: columnId },
    });
    return result;
  }

  async updateColumn(updatedData: {
    columnId: string;
    title: string;
    description: string;
  }) {
    const result = await this.dbService.columns.update({
      where: { id: updatedData.columnId },
      data: {
        column_title: updatedData.columnId,
        description: updatedData.description,
        updated_at: new Date(),
      },
    });
    return result;
  }
  async removeColumn(columnId: string) {
    const result = await this.dbService.columns.delete({
      where: {
        id: columnId,
      },
    });
    return result;
  }
}
