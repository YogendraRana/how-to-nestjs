/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Post` table. All the data in the column will be lost.
  - Made the column `date_of_birth` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "isPublic",
ADD COLUMN     "is_private_post" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "caption" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "date_of_birth" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;
