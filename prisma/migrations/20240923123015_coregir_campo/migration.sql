/*
  Warnings:

  - You are about to drop the column `latiud` on the `paradas` table. All the data in the column will be lost.
  - Added the required column `latitud` to the `paradas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "paradas" DROP COLUMN "latiud",
ADD COLUMN     "latitud" VARCHAR(100) NOT NULL;
