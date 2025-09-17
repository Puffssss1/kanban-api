import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(private taskRepository: TaskRepository) {}
  /*
  verify the user
  check if the board is existing
  check if the user is a member of the board
  check if the assignee is a member of the board
  check if the user is an editor
  check if the assignee is an editor
  */
  async findUserById(userId: string) {
    const result = await this.taskRepository.findUserById(userId);
    if (!result) {
      throw new NotFoundException('User not Found');
    }
    return result;
  }

  async findUserByEmail(email: string) {
    const result = await this.taskRepository.findUserByEmail(email);
    if (!result) throw new NotFoundException('Assined User not Found');
    return result;
  }

  async findBoard(boardId: string) {
    const result = await this.taskRepository.findBoard(boardId);
    if (!result) throw new NotFoundException('Board Not found');
    return result;
  }

  async membership(boardId: string, userId: string, errorMessage?: string) {
    const result = await this.taskRepository.membership(boardId, userId);
    if (!result)
      throw new ForbiddenException(
        errorMessage ?? 'You are not a member of the board',
      );
    return result;
  }

  async createTask(payload: {
    boardId: string;
    columnId: string;
    userId: string;
    assignedTo: string;
    deadline: Date;
    taskTitle: string;
    description: string;
    priority: string;
  }) {
    // verify the user
    await this.findUserById(payload.userId);
    // check if the board is existing
    await this.findBoard(payload.boardId);
    // check if the user is a member of the board
    const userMembership = await this.membership(
      payload.boardId,
      payload.userId,
      'You are not a member of this board, so you cannot assign tasks',
    );
    // check if the user is an editor
    if (userMembership.role === 'VIEWER') {
      throw new ForbiddenException('You are not an EDITOR of this board');
    }
    // check the assignee if it exist
    const assignedUser = await this.findUserByEmail(payload.assignedTo);
    // check if the assignee is a member of the board
    await this.membership(
      payload.boardId,
      assignedUser.id,
      'The assignee is not a member of this board',
    );

    const taskData = {
      columnId: payload.columnId,
      assignedUser: assignedUser.id,
      deadline: payload.deadline,
      taskTitle: payload.taskTitle,
      description: payload.description,
      priority: payload.priority,
    };
    return this.taskRepository.createTask(taskData);
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
