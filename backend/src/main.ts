import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('SaleMedicine API')
    .setDescription('The SaleMedicine API description')
    .setVersion('1.0')
    .addTag('salemedicine')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors(); // Enable CORS

  await app.listen(3000);
}
bootstrap();