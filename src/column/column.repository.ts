import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ColumnRepository {
  constructor(private dbSerice: DatabaseService) {}

  //findUser by id
  async findUser(id: string) {
    const result = await this.dbSerice.users.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });
    return result;
  }
  //findBoard by id
  async findBoard(id: string) {
    const result = await this.dbSerice.boards.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
    return result;
  }

  // Post Crete Columns

  // boardId
  // userId
  // column
  // Get all the column for a user and include task
  async findAllColumn(boardId: string, userId: string, includeTask: boolean) {
    const result = await this.dbSerice.columns.findMany({
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
