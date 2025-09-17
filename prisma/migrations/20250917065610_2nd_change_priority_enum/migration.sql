/*
  Warnings:

  - The values [ASAP] on the enum `Priority` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Priority_new" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
ALTER TABLE "public"."Task_box" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "public"."Task_box" ALTER COLUMN "priority" TYPE "public"."Priority_new" USING ("priority"::text::"public"."Priority_new");
ALTER TYPE "public"."Priority" RENAME TO "Priority_old";
ALTER TYPE "public"."Priority_new" RENAME TO "Priority";
DROP TYPE "public"."Priority_old";
ALTER TABLE "public"."Task_box" ALTER COLUMN "priority" SET DEFAULT 'LOW';
COMMIT;
