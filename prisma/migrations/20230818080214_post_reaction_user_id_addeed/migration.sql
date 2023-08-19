/*
  Warnings:

  - Added the required column `user_id` to the `PostReaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PostReaction" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
