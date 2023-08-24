/*
  Warnings:

  - Added the required column `otp_type` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "otp_type" "OtpType" NOT NULL;
