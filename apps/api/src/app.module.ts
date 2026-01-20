import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ValidationPipe } from '@nestjs/common';

// Core
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Auth & Users
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

// Companies & Relationships
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { RelationshipsController } from './relationships.controller';
import { RelationshipsService } from './relationships.service';

// Sectors & Categories
import { SectorsController } from './sectors.controller';
import { SectorsService } from './sectors.service';

// Products
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

// Messaging
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

// RFQ (Request for Quote)
import { RfqController } from './rfq.controller';
import { RfqService } from './rfq.service';

// Analytics & Dashboard
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

// Notifications
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

// Activities
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';

// External Integrations
import { OdooController } from './odoo.controller';
import { OdooService } from './odoo.service';

// Support Services
import { SeedService } from './seed.service';
import { EmailService } from './email.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    // Rate Limiting: 100 requests per minute per IP
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    CompaniesController,
    RelationshipsController,
    SectorsController,
    ProductsController,
    MessagesController,
    RfqController,
    DashboardController,
    AnalyticsController,
    NotificationsController,
    ActivitiesController,
    OdooController,
    AdminController,
  ],
  providers: [
    // Services
    AppService,
    AuthService,
    UsersService,
    CompaniesService,
    RelationshipsService,
    SectorsService,
    ProductsService,
    MessagesService,
    RfqService,
    DashboardService,
    AnalyticsService,
    NotificationsService,
    ActivitiesService,
    OdooService,
    SeedService,
    EmailService,
    AdminService,

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
