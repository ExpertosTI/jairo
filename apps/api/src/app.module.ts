import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OdooService } from './odoo.service';
import { OdooController } from './odoo.controller';
import { SeedService } from './seed.service';
import { EmailService } from './email.service';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { SectorsController } from './sectors.controller';
import { SectorsService } from './sectors.service';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RelationshipsController } from './relationships.controller';
import { RelationshipsService } from './relationships.service';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    // Rate Limiting: 100 requests per minute per IP
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
  ],
  controllers: [
    AppController,
    OdooController,
    CompaniesController,
    SectorsController,
    ActivitiesController,
    AuthController,
    UsersController,
    RelationshipsController,
    DashboardController,
  ],
  providers: [
    AppService,
    OdooService,
    SeedService,
    EmailService,
    CompaniesService,
    SectorsService,
    ActivitiesService,
    AuthService,
    UsersService,
    RelationshipsService,
    DashboardService,
    // Global Rate Limiting Guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global Validation Pipe
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
  ],
})
export class AppModule { }
