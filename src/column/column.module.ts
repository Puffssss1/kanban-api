import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { ColumnRepository } from './column.repository';

@Module({
  controllers: [ColumnController],
  providers: [ColumnService, ColumnRepository],
})
export class ColumnModule {}
