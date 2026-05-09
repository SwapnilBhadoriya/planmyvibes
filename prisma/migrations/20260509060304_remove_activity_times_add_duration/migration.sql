/*
  Warnings:

  - You are about to drop the column `endTime` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `activities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "activities" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "durationMinutes" INTEGER;
