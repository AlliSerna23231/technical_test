import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppDataSource } from '../database/data-source'; 

async function bootstrap() {
  await AppDataSource.initialize()
    .then(() => console.log('Data Source initialized!'))
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
      process.exit(1); 
    });

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Training Tracker API')
    .setDescription('API RESTful para gestión de entrenamientos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
}
bootstrap();
