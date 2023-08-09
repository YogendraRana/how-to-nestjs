/*
  Warnings:

  - You are about to drop the column `is_public` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_public",
ADD COLUMN     "is_private_account" BOOLEAN NOT NULL DEFAULT false;
