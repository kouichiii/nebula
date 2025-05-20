/*
  Warnings:

  - You are about to drop the column `mongoId` on the `Article` table. All the data in the column will be lost.
  - Added the required column `storageId` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Article_mongoId_key";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "mongoId",
ADD COLUMN     "storageUrl" TEXT NOT NULL;
