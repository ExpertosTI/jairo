import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OdooService } from './odoo.service';
import { OdooController } from './odoo.controller';
import { SeedService } from './seed.service';
import { EmailService } from './email.service';

@Module({
  imports: [],
  controllers: [AppController, OdooController],
  providers: [AppService, OdooService, SeedService, EmailService],
})
export class AppModule { }

