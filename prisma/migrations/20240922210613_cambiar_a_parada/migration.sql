/*
  Warnings:

  - You are about to drop the `Parada` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "marcar_paradas" DROP CONSTRAINT "marcar_paradas_id_parada_fkey";

-- DropTable
DROP TABLE "Parada";

-- CreateTable
CREATE TABLE "paradas" (
    "id" SERIAL NOT NULL,
    "parada" VARCHAR(50) NOT NULL,
    "tipo" VARCHAR(10) NOT NULL,
    "latiud" VARCHAR(100) NOT NULL,
    "longitud" VARCHAR(100) NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "id_registrador" INTEGER NOT NULL,

    CONSTRAINT "paradas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "marcar_paradas" ADD CONSTRAINT "marcar_paradas_id_parada_fkey" FOREIGN KEY ("id_parada") REFERENCES "paradas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
