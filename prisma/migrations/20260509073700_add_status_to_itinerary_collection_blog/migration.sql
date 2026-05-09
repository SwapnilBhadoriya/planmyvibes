-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "itineraries" ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT';
