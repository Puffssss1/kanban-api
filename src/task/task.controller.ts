import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/common/types';

/*
TODO create a task
* POST /boards/:boardId/columns/:columnId/tasks
? status - not yet started
  * create a task
  * assign the task to a user via email
  * add what severity/Priority: LOW | MEDIUM | HIGH | CRITICAL
TODO GET task from a board
* GET /boards/:boardId/tasks
? status - not yet started
* Get all tasks in a board.
TODO GET the task from a board
* GET /boards/:boardId/columns/:columnId?includeTasks=true
? status done
* Get tasks in column. (already have this from column by query param includeTask = true)
TODO Get single task.
* GET /boards/:boardId/tasks/:taskId
? status not yet started
* Get single task.
TODO Update the task
* PATCH /boards/:boardId/tasks/:taskId
? status not yet started
* Update task (title, description, assignee, severity, due date).
TODO move a task to a different column
* PATCH /boards/:boardId/tasks/:taskId/move 
? status not yet started
* Move task to another column.
TODO delete task
* DELETE /boards/:boardId/tasks/:taskId 
? status not yet started
* Delete task.
*/

@UseGuards(AuthGuard('jwt'))
@Controller('/boards/:boardId')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Create task
  @Post('columns/:columnId/tasks')
  create(
    @Param('boardId') boardId: string,
    @Req() userId: AuthenticatedRequest,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const payload = {
      boardId,
      userId,
      assignedTo: createTaskDto.assignedTo,
      deadline: new Date().toString(),
      taskTitle: createTaskDto.taskTitle,
      description: createTaskDto.description,
      priority: createTaskDto.priority,
    };
    return this.taskService.create(payload);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
