/*
  Warnings:

  - The values [COURSE_INTRUCTOR] on the enum `SubRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubRole_new" AS ENUM ('DG', 'HEAD', 'SECRETARY', 'STAFF', 'COURSE_COORDINATOR', 'COURSE_INSTRUCTOR');
ALTER TABLE "public"."User" ALTER COLUMN "sub_role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "sub_role" TYPE "SubRole_new" USING ("sub_role"::text::"SubRole_new");
ALTER TYPE "SubRole" RENAME TO "SubRole_old";
ALTER TYPE "SubRole_new" RENAME TO "SubRole";
DROP TYPE "public"."SubRole_old";
ALTER TABLE "User" ALTER COLUMN "sub_role" SET DEFAULT 'STAFF';
COMMIT;
