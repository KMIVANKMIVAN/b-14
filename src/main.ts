import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UnauthorizedExceptionFilter } from './administracion/filtros/unauthorized-exception.filter';
import { ForbiddenExceptionFilter } from './administracion/filtros/forbidden-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('API DE CONTROL DE PARADAS')
    .setDescription('Lista de las PIS')
    .setVersion('1.0')
    .addTag('sindicato mixto de transporte 14 de septiembre-chaquipampa').addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'token de acceso', // El nombre del esquema de seguridad
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalFilters(new UnauthorizedExceptionFilter(), new ForbiddenExceptionFilter(),);

  await app.listen(3040);
}
bootstrap();
