import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // swagger
    const config = new DocumentBuilder()
    .setTitle('How to Nest JS')
    .setDescription('The How to Nest JS API description')
    .setVersion('1.0')
    .addTag('how to nest js')
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(8000);
}

bootstrap();
