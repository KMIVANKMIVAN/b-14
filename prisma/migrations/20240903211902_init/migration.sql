-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombres" VARCHAR(50) NOT NULL,
    "apellidos" VARCHAR(50) NOT NULL,
    "ci" VARCHAR(50) NOT NULL,
    "complemento" VARCHAR(10),
    "correo" VARCHAR(50),
    "contrasenia" VARCHAR(100) NOT NULL,
    "es_activo" BOOLEAN NOT NULL DEFAULT true,
    "se_cambiado_cntr" BOOLEAN NOT NULL DEFAULT false,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "rol" VARCHAR(50) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_ci_key" ON "usuarios"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
