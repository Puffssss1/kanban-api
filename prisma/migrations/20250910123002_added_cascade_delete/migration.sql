-- DropForeignKey
ALTER TABLE "public"."Board_members" DROP CONSTRAINT "Board_members_board_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Board_members" ADD CONSTRAINT "Board_members_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."Boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
