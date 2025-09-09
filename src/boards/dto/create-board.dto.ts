import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
  //   @IsNotEmpty()
  //   @IsString()
  //   owner_id: string;

  @IsNotEmpty()
  @IsString()
  board_name: string;
}
