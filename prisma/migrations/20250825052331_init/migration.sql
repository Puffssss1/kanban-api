-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('VIEWER', 'EDITOR');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('HIGH', 'LOW', 'ASAP');

-- CreateTable
CREATE TABLE "public"."Users" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Boards" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "board_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Board_members" (
    "id" TEXT NOT NULL,
    "board_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "public"."Role" DEFAULT 'VIEWER',

    CONSTRAINT "Board_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Columns" (
    "id" TEXT NOT NULL,
    "board_id" TEXT NOT NULL,
    "column_title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Columns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Task_box" (
    "id" TEXT NOT NULL,
    "column_id" TEXT NOT NULL,
    "assigned_to" TEXT,
    "deadline" TIMESTAMP(3),
    "task_title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "public"."Priority" NOT NULL DEFAULT 'LOW',
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_box_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Board_members_board_id_user_id_key" ON "public"."Board_members"("board_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."Boards" ADD CONSTRAINT "Boards_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Board_members" ADD CONSTRAINT "Board_members_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."Boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Board_members" ADD CONSTRAINT "Board_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Columns" ADD CONSTRAINT "Columns_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."Boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task_box" ADD CONSTRAINT "Task_box_column_id_fkey" FOREIGN KEY ("column_id") REFERENCES "public"."Columns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task_box" ADD CONSTRAINT "Task_box_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
