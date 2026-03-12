/*
  Warnings:

  - The values [pending,in_circulation,rejected,approved,forwarded] on the enum `FileStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,published] on the enum `NewsStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,approved,rejected] on the enum `WorkflowStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "MagazineStatus" AS ENUM ('PENDING', 'PUBLISHED');

-- AlterEnum
BEGIN;
CREATE TYPE "FileStatus_new" AS ENUM ('PENDING', 'IN_CIRCULATION', 'REJECTED', 'APPROVED', 'FORWARDED');
ALTER TABLE "public"."File" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "File" ALTER COLUMN "status" TYPE "FileStatus_new" USING ("status"::text::"FileStatus_new");
ALTER TABLE "FileLog" ALTER COLUMN "status" TYPE "FileStatus_new" USING ("status"::text::"FileStatus_new");
ALTER TYPE "FileStatus" RENAME TO "FileStatus_old";
ALTER TYPE "FileStatus_new" RENAME TO "FileStatus";
DROP TYPE "public"."FileStatus_old";
ALTER TABLE "File" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NewsStatus_new" AS ENUM ('PENDING', 'PUBLISHED');
ALTER TABLE "public"."News" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "News" ALTER COLUMN "status" TYPE "NewsStatus_new" USING ("status"::text::"NewsStatus_new");
ALTER TYPE "NewsStatus" RENAME TO "NewsStatus_old";
ALTER TYPE "NewsStatus_new" RENAME TO "NewsStatus";
DROP TYPE "public"."NewsStatus_old";
ALTER TABLE "News" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "WorkflowStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "public"."WorkFlow" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "WorkFlow" ALTER COLUMN "status" TYPE "WorkflowStatus_new" USING ("status"::text::"WorkflowStatus_new");
ALTER TYPE "WorkflowStatus" RENAME TO "WorkflowStatus_old";
ALTER TYPE "WorkflowStatus_new" RENAME TO "WorkflowStatus";
DROP TYPE "public"."WorkflowStatus_old";
ALTER TABLE "WorkFlow" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "News" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "WorkFlow" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "Magazine" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "main_image_uri" TEXT NOT NULL,
    "images" TEXT[],
    "status" "MagazineStatus" NOT NULL DEFAULT 'PENDING',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Magazine_pkey" PRIMARY KEY ("id")
);
