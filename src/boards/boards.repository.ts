import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

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

  // Get all boards
  findAll() {
    return this.dbService.boards.findMany({});
  }

  //create boards
  async createBoards(boardName: string, boardOwner: string) {
    //check if the user exist
    const checkUserID = await this.findUserById(boardOwner);
    if (checkUserID === null) {
      throw new NotFoundException('There is no User');
    }
    const saveData = this.dbService.boards.create({
      data: {
        owner_id: boardOwner,
        board_name: boardName,
        updated_at: new Date(),
      },
    });
    return saveData;
  }

  async findOne(id: string) {
    const result = await this.dbService.boards.findUnique({
      where: {
        id: id,
      },
    });
    if (!result) {
      throw new NotFoundException(`board: ${id} not found`);
    }
    return result;
  }

  async getBoardsOfUser(authenticatedUser: string) {
    const result = await this.dbService.boards.findMany({
      where: {
        owner_id: authenticatedUser,
      },
    });
    if (!result) {
      throw new BadRequestException('User is not Logged in');
    }
    return result;
  }
}
