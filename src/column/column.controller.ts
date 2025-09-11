import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Request } from 'express';

/*
TODO create a column in a specific board
? status - ongoing
* POST /boards/:boardId/columns
* create a column for a specific board
TODO get column for a user
? status - ongoing
* GET /boards/:boardId/columns
* get all the column in a specific board from a user
TODO get a single column by id
? status - ongoing
* GET /boards/:boardId/columns/:columnId
* get a column by ID from a board
TODO Edit a column
? status - ongoing
* PATCH /boards/:boardId/columns/:columnId
* edit a board 
TODO Delete column
? status - ongoing
* DELETE /boards/:boardId/columns/:columnId
* delete a column
*/

@Controller('boards/:boardId/columns')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  // POST /boards/:boardId/columns
  // Create columns
  @Post()
  createColumn(
    @Param('id') boardId: string,
    @Body() createColumnDto: CreateColumnDto,
    @Req() req: Request,
  ) {
    const columnData = {
      boardId: boardId,
      userId: (req.user as any).id,
      columnTitle: createColumnDto.title,
      columnDescription: createColumnDto.description,
    };
    return this.columnService.createColumn(columnData);
  }

  // GET /boards/:boardId/columns
  // get all the column in a specific board from a user
  @Get()
  findAllColumn(
    @Param('id') boardId: string,
    @Req() req: Request,
    @Query('includeTasks') includeTask: string,
  ) {
    const userId = (req.user as any).id;
    const includeTaskFlag = includeTask === 'true';
    return this.columnService.findAllColumn(boardId, userId, includeTaskFlag);
  }

  // GET /boards/:boardId/columns/:columnId
  @Get(':columnId')
  findOne(@Param('id') id: string) {
    return this.columnService.findOne(+id);
  }

  // PATCH /boards/:boardId/columns/:columnId
  @Patch(':columnId')
  update(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
    return this.columnService.update(+id);
  }

  // DELETE /boards/:boardId/columns/:columnId
  @Delete(':columnId')
  remove(@Param('id') id: string) {
    return this.columnService.remove(+id);
  }
}
