import { Module } from '@nestjs/common';
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
  imports: [],
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
  ],
})
export class AppModule { }
