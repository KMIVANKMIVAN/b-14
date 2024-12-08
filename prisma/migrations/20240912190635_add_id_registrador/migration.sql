/*
  Warnings:

  - Added the required column `id_registrador` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "id_registrador" INTEGER NOT NULL;
