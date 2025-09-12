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
  UseGuards,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto, UpdateColumnDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request.interface';

/*
TODO create a column in a specific board
? status - done
* POST /boards/:boardId/columns
* create a column for a specific board
TODO get column for a user
? status - done
* GET /boards/:boardId/columns
* get all the column in a specific board from a user
TODO get a single column by id
? status - done
* GET /boards/:boardId/columns/:columnId
* get a column by ID from a board user should be a member of thee board
TODO Edit a column
? status - ongoing
* PATCH /boards/:boardId/columns/:columnId
* edit a board 
TODO Delete column
? status - ongoing
* DELETE /boards/:boardId/columns/:columnId
* delete a column
*/

@UseGuards(AuthGuard('jwt'))
@Controller('boards/:boardId/columns')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  // POST /boards/:boardId/columns
  // Create columns
  @Post()
  createColumn(
    @Param('boardId') boardId: string,
    @Body() createColumnDto: CreateColumnDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const columnData = {
      boardId: boardId,
      userId: req.user.id,
      columnTitle: createColumnDto.title,
      columnDescription: createColumnDto.description,
    };
    return this.columnService.createColumn(columnData);
  }

  // GET /boards/:boardId/columns
  // get all the column in a specific board from a user
  @Get()
  findAllColumn(
    @Param('boardId') boardId: string,
    @Req() req: AuthenticatedRequest,
    @Query('includeTasks') includeTask: string,
  ) {
    const userId = req.user.id;
    const includeTaskFlag = includeTask === 'true';
    return this.columnService.findAllColumn(boardId, userId, includeTaskFlag);
  }

  // GET /boards/:boardId/columns/:columnId
  @Get(':columnId')
  findColumnById(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.columnService.findColumnById(boardId, columnId, userId);
  }

  // PATCH /boards/:boardId/columns/:columnId
  @Patch(':columnId')
  updateColumn(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Body() updateColumnDto: UpdateColumnDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const columnData = {
      boardId: boardId,
      userId: req.user.id,
      columnId: columnId,
      title: updateColumnDto.title,
      description: updateColumnDto.description,
    };
    return this.columnService.updateColumn(columnData);
  }

  // DELETE /boards/:boardId/columns/:columnId
  @Delete(':columnId')
  removeColumn(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.columnService.removeColumn(boardId, columnId, req.user.id);
  }
}
