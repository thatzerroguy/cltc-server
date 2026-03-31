-- AlterTable
ALTER TABLE "FileLog" ADD COLUMN     "to_user_id" TEXT;

-- AlterTable
ALTER TABLE "WorkFlow" ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "FileLog" ADD CONSTRAINT "FileLog_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkFlow" ADD CONSTRAINT "WorkFlow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
