-- CreateTable
CREATE TABLE "Parada" (
    "id" SERIAL NOT NULL,
    "parada" VARCHAR(50) NOT NULL,
    "tipo" VARCHAR(10) NOT NULL,
    "latiud" VARCHAR(100) NOT NULL,
    "longitud" VARCHAR(100) NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "id_registrador" INTEGER NOT NULL,

    CONSTRAINT "Parada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcar_paradas" (
    "id" SERIAL NOT NULL,
    "tipo" VARCHAR(10) NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,
    "id_parada" INTEGER NOT NULL,

    CONSTRAINT "marcar_paradas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "marcar_paradas" ADD CONSTRAINT "marcar_paradas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marcar_paradas" ADD CONSTRAINT "marcar_paradas_id_parada_fkey" FOREIGN KEY ("id_parada") REFERENCES "Parada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
