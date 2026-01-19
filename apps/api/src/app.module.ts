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

@Module({
  imports: [],
  controllers: [
    AppController,
    OdooController,
    CompaniesController,
    SectorsController,
    ActivitiesController
  ],
  providers: [
    AppService,
    OdooService,
    SeedService,
    EmailService,
    CompaniesService,
    SectorsService,
    ActivitiesService
  ],
})
export class AppModule { }
