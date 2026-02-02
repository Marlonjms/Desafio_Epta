import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // COLOQUE AQUI: Permite que o React acesse a API
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
