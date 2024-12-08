-- CreateTable
CREATE TABLE "hoja_rutas" (
    "id" SERIAL NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "hoja_rutas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "hoja_rutas" ADD CONSTRAINT "hoja_rutas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
