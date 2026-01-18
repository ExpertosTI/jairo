import { Controller, Get } from '@nestjs/common';
import { OdooService } from './odoo.service';

@Controller('odoo')
export class OdooController {
    constructor(private readonly odooService: OdooService) { }

    @Get('products')
    async getProducts() {
        return this.odooService.getProducts();
    }
}
