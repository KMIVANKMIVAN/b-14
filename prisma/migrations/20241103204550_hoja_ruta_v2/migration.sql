/*
  Warnings:

  - Added the required column `id_registrador` to the `hoja_rutas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "hoja_rutas" ADD COLUMN     "id_registrador" INTEGER NOT NULL;
