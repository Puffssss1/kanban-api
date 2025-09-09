import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { BoardsModule } from './boards/boards.module';

@Module({
  imports: [UsersModule, AuthModule, DatabaseModule, BoardsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
