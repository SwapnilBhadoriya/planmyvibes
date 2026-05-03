/*
  Warnings:

  - Made the column `name` on table `places` required. This step will fail if there are existing NULL values in that column.
  - Made the column `destinationId` on table `places` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "places" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "destinationId" SET NOT NULL;
