-- CreateTable
CREATE TABLE "grupos" (
    "id" SERIAL NOT NULL,
    "grupo" VARCHAR(50) NOT NULL,
    "nro" VARCHAR(10) NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grupos_pkey" PRIMARY KEY ("id")
);
