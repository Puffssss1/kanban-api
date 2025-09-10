import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { BoardsModule } from './boards/boards.module';
import { ColumnModule } from './column/column.module';

@Module({
  imports: [UsersModule, AuthModule, DatabaseModule, BoardsModule, ColumnModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
