import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OdooService } from './odoo.service';
import { OdooController } from './odoo.controller';

@Module({
  imports: [],
  controllers: [AppController, OdooController],
  providers: [AppService, OdooService],
})
export class AppModule { }
