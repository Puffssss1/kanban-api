import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Priority } from './enums';

@Injectable()
export class TaskRepository {
  constructor(private dbService: DatabaseService) {}
  /*
  verify the user
  check if the board is existing
  check if the user is a member
  */
  async findUserById(userId: string) {
    const result = await this.dbService.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
      },
    });
    return result;
  }
  async findUserByEmail(email: string) {
    const result = await this.dbService.users.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
      },
    });
    return result;
  }
  async findBoard(boardId: string) {
    const result = await this.dbService.boards.findUnique({
      where: { id: boardId },
      select: {
        id: true,
      },
    });
    return result;
  }

  async membership(boardId: string, userId: string) {
    const result = await this.dbService.board_members.findFirst({
      where: {
        board_id: boardId,
        user_id: userId,
      },
    });
    return result;
  }

  // create task
  async createTask(taskData: {
    columnId: string;
    assignedUser: string;
    deadline: Date;
    taskTitle: string;
    description: string;
    priority: string;
  }) {
    // check the last position of the task
    const lastPosition = await this.dbService.task_box.findFirst({
      where: { column_id: taskData.columnId },
      orderBy: { position: 'desc' },
    });
    const nextPosition = lastPosition ? lastPosition.position + 1 : 1;
    const result = await this.dbService.task_box.create({
      data: {
        deadline: taskData.deadline,
        task_title: taskData.taskTitle,
        description: taskData.description,
        priority: taskData.priority as Priority,
        position: nextPosition,
        column: {
          connect: { id: taskData.columnId },
        },
        user: {
          connect: { id: taskData.assignedUser },
        },
      },
    });
    return result;
  }
}
