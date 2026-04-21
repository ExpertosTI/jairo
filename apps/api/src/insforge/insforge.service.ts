import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { companies, products, sectors } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class InsforgeService {
    private readonly logger = new Logger(InsforgeService.name);

    constructor(private readonly db: DatabaseService) {}

    async getDepuratedDataForAI() {
        this.logger.log('Extrayendo datos depurados para Insforge AI...');

        const allCompanies = await this.db.drizzle.select().from(companies).where(eq(companies.status, 'active'));
        const allProducts = await this.db.drizzle.select().from(products);

        const formattedData = allCompanies.map(company => {
            const companyProducts = allProducts.filter(p => p.companyId === company.id);
            
            const cleanDescription = (text?: string | null) => {
                if (!text) return '';
                return text.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
            };

            return {
                insforge_id: `COMP_${company.id}`,
                entity_type: 'company',
                name: company.name,
                location: cleanDescription(company.address),
                semantic_context: `Empresa ${company.name}. Ubicada en ${cleanDescription(company.address)}.`,
                products_catalog: companyProducts.map(p => ({
                    id: p.id,
                    name: p.name,
                    description: cleanDescription(p.description),
                    price: p.price,
                })),
                raw_metadata: company.aiMetadata ? JSON.parse(company.aiMetadata) : {}
            };
        });

        return {
            status: 'success',
            count: formattedData.length,
            timestamp: new Date().toISOString(),
            data: formattedData
        };
    }

    async updateAiMetadata(companyId: string, metadata: any) {
        await this.db.drizzle.update(companies)
            .set({ aiMetadata: JSON.stringify(metadata) })
            .where(eq(companies.id, companyId));
            
        this.logger.log(`Metadata de IA actualizada para la empresa ${companyId}`);
        return { success: true };
    }
}
