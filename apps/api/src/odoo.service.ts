import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'xmlrpc';
import * as xmlrpc from 'xmlrpc';

@Injectable()
export class OdooService {
    private readonly logger = new Logger(OdooService.name);
    private url: string;
    private db: string;
    private username: string;
    private apiKey: string;
    private uid: number | null = null;

    constructor() {
        this.url = process.env.ODOO_URL || '';
        this.db = process.env.ODOO_DB || '';
        this.username = process.env.ODOO_USERNAME || '';
        this.apiKey = process.env.ODOO_API_KEY || '';
    }

    // Placeholder for real authentication logic
    async authenticate(): Promise<number> {
        const commonClient = xmlrpc.createClient({ url: `${this.url}/xmlrpc/2/common` });

        return new Promise((resolve, reject) => {
            commonClient.methodCall('authenticate', [this.db, this.username, this.apiKey, {}], (error, uid) => {
                if (error) {
                    console.error('Odoo Auth Error:', error);
                    reject(error);
                } else {
                    this.logger.log(`Odoo Auth Success, UID: ${uid}`);
                    this.uid = Number(uid);
                    resolve(this.uid);
                }
            });
        });
    }

    async getProducts() {
        if (!this.uid) await this.authenticate();

        const objectClient = xmlrpc.createClient({ url: `${this.url}/xmlrpc/2/object` });

        return new Promise((resolve, reject) => {
            objectClient.methodCall('execute_kw', [
                this.db,
                this.uid,
                this.apiKey,
                'product.product',
                'search_read',
                [[]], // Domain: Empty list for all products
                { fields: ['name', 'list_price', 'qty_available'], limit: 10 }
            ], (error, products) => {
                if (error) {
                    console.error('Odoo Fetch Error:', error);
                    reject(error);
                } else {
                    resolve(products);
                }
            });
        });
    }
}
