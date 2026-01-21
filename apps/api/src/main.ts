import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 10485760, // 10MB limit for file uploads/payloads
    })
  );

  // Security Headers (Helmet) - Temporarily disabled for debugging
  // await app.register(helmet, {
  //   contentSecurityPolicy: {
  //     directives: {
  //       defaultSrc: ["'self'"],
  //       styleSrc: ["'self'", "'unsafe-inline'"],
  //       imgSrc: ["'self'", "data:", "https:"],
  //       scriptSrc: ["'self'"],
  //     },
  //   },
  //   crossOriginEmbedderPolicy: false,
  // });

  // Input Validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // CORS - Restricted to specific origins
  const allowedOrigins = [
    'https://jairoapp.renace.tech',
    'https://www.jairoapp.renace.tech',
  ];

  // Add localhost in development
  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:3000', 'http://localhost:3001');
  }

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(3001, '0.0.0.0');
  console.log(`🚀 API running on port 3001 (${process.env.NODE_ENV || 'development'})`);
}
bootstrap();
