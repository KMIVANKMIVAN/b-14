/*
  Warnings:

  - A unique constraint covering the columns `[placa]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_grupo` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placa` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "id_grupo" INTEGER NOT NULL,
ADD COLUMN     "placa" VARCHAR(7) NOT NULL,
ADD COLUMN     "propietario" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_placa_key" ON "usuarios"("placa");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "grupos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
