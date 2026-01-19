import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Pool } from 'pg';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RfqService {
    private readonly logger = new Logger(RfqService.name);
    private pool: Pool;
    private readonly jwtSecret = process.env.JWT_SECRET;

    constructor() {
        this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
        this.initTables();
    }

    private async initTables() {
        const client = await this.pool.connect();
        try {
            await client.query(`
                CREATE TABLE IF NOT EXISTS rfqs (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    requester_id UUID NOT NULL,
                    company_id UUID,
                    title VARCHAR(300) NOT NULL,
                    description TEXT,
                    sector_id UUID,
                    quantity INTEGER,
                    budget DECIMAL(15,2),
                    deadline DATE,
                    status VARCHAR(50) DEFAULT 'open',
                    is_public BOOLEAN DEFAULT true,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS rfq_targets (
                    rfq_id UUID REFERENCES rfqs(id),
                    company_id UUID,
                    PRIMARY KEY (rfq_id, company_id)
                );

                CREATE TABLE IF NOT EXISTS rfq_quotes (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    rfq_id UUID REFERENCES rfqs(id),
                    company_id UUID NOT NULL,
                    user_id UUID NOT NULL,
                    price DECIMAL(15,2) NOT NULL,
                    delivery_days INTEGER,
                    notes TEXT,
                    status VARCHAR(50) DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT NOW()
                );

                CREATE INDEX IF NOT EXISTS idx_rfqs_status ON rfqs(status, created_at DESC);
                CREATE INDEX IF NOT EXISTS idx_rfq_quotes_rfq ON rfq_quotes(rfq_id);
            `);
            this.logger.log('✅ RFQ tables initialized');
        } catch (error) {
            this.logger.warn('RFQ tables may already exist');
        } finally {
            client.release();
        }
    }

    private getUserFromToken(token: string): any {
        if (!token || !this.jwtSecret) {
            throw new HttpException('No autorizado', HttpStatus.UNAUTHORIZED);
        }
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch {
            throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
        }
    }

    async createRfq(token: string, data: any) {
        const user = this.getUserFromToken(token);
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            const result = await client.query(`
                INSERT INTO rfqs (requester_id, company_id, title, description, sector_id, quantity, budget, deadline, is_public)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
            `, [
                user.id,
                user.companyId || null,
                data.title,
                data.description,
                data.sectorId || null,
                data.quantity || null,
                data.budget || null,
                data.deadline || null,
                !data.targetCompanyIds || data.targetCompanyIds.length === 0
            ]);

            const rfq = result.rows[0];

            // Add target companies if specified
            if (data.targetCompanyIds && data.targetCompanyIds.length > 0) {
                for (const companyId of data.targetCompanyIds) {
                    await client.query(
                        'INSERT INTO rfq_targets (rfq_id, company_id) VALUES ($1, $2)',
                        [rfq.id, companyId]
                    );
                }
            }

            await client.query('COMMIT');

            this.logger.log(`📋 RFQ creado: ${rfq.title}`);

            return { rfq, mensaje: 'Solicitud de cotización creada exitosamente' };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async listPublicRfqs(sector?: string, page: number = 1) {
        const client = await this.pool.connect();
        const limit = 20;
        const offset = (page - 1) * limit;

        try {
            let query = `
                SELECT 
                    r.*,
                    u.name as requester_name,
                    c.name as company_name,
                    s.name as sector_name,
                    (SELECT COUNT(*) FROM rfq_quotes WHERE rfq_id = r.id) as quote_count
                FROM rfqs r
                LEFT JOIN users u ON r.requester_id = u.id
                LEFT JOIN companies c ON r.company_id = c.id
                LEFT JOIN sectors s ON r.sector_id = s.id
                WHERE r.is_public = true AND r.status = 'open'
            `;
            const params: any[] = [];

            if (sector) {
                query += ` AND s.name ILIKE $${params.length + 1}`;
                params.push(`%${sector}%`);
            }

            query += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
            params.push(limit, offset);

            const result = await client.query(query, params);

            const countResult = await client.query(
                'SELECT COUNT(*) FROM rfqs WHERE is_public = true AND status = $1',
                ['open']
            );

            return {
                rfqs: result.rows,
                total: parseInt(countResult.rows[0].count),
                pagina: page,
                totalPaginas: Math.ceil(parseInt(countResult.rows[0].count) / limit)
            };
        } finally {
            client.release();
        }
    }

    async getMyRfqs(token: string) {
        const user = this.getUserFromToken(token);
        const client = await this.pool.connect();

        try {
            const result = await client.query(`
                SELECT 
                    r.*,
                    s.name as sector_name,
                    (SELECT COUNT(*) FROM rfq_quotes WHERE rfq_id = r.id) as quote_count
                FROM rfqs r
                LEFT JOIN sectors s ON r.sector_id = s.id
                WHERE r.requester_id = $1
                ORDER BY r.created_at DESC
            `, [user.id]);

            return { rfqs: result.rows };
        } finally {
            client.release();
        }
    }

    async getReceivedRfqs(token: string) {
        const user = this.getUserFromToken(token);
        const client = await this.pool.connect();

        try {
            const result = await client.query(`
                SELECT 
                    r.*,
                    u.name as requester_name,
                    c.name as requester_company,
                    s.name as sector_name,
                    (SELECT COUNT(*) FROM rfq_quotes WHERE rfq_id = r.id AND user_id = $1) as my_quotes
                FROM rfqs r
                LEFT JOIN users u ON r.requester_id = u.id
                LEFT JOIN companies c ON r.company_id = c.id
                LEFT JOIN sectors s ON r.sector_id = s.id
                WHERE r.status = 'open'
                  AND (r.is_public = true OR EXISTS (
                      SELECT 1 FROM rfq_targets rt 
                      WHERE rt.rfq_id = r.id AND rt.company_id = $2
                  ))
                ORDER BY r.created_at DESC
            `, [user.id, user.companyId || null]);

            return { rfqs: result.rows };
        } finally {
            client.release();
        }
    }

    async getRfqDetail(id: string) {
        const client = await this.pool.connect();

        try {
            const rfq = await client.query(`
                SELECT 
                    r.*,
                    u.name as requester_name,
                    u.email as requester_email,
                    c.name as company_name,
                    s.name as sector_name
                FROM rfqs r
                LEFT JOIN users u ON r.requester_id = u.id
                LEFT JOIN companies c ON r.company_id = c.id
                LEFT JOIN sectors s ON r.sector_id = s.id
                WHERE r.id = $1
            `, [id]);

            if (rfq.rows.length === 0) {
                throw new HttpException('RFQ no encontrado', HttpStatus.NOT_FOUND);
            }

            const quotes = await client.query(`
                SELECT 
                    q.*,
                    u.name as quoter_name,
                    c.name as quoter_company
                FROM rfq_quotes q
                LEFT JOIN users u ON q.user_id = u.id
                LEFT JOIN companies c ON q.company_id = c.id
                WHERE q.rfq_id = $1
                ORDER BY q.price ASC
            `, [id]);

            return {
                rfq: rfq.rows[0],
                cotizaciones: quotes.rows
            };
        } finally {
            client.release();
        }
    }

    async submitQuote(rfqId: string, token: string, data: any) {
        const user = this.getUserFromToken(token);
        const client = await this.pool.connect();

        try {
            const result = await client.query(`
                INSERT INTO rfq_quotes (rfq_id, company_id, user_id, price, delivery_days, notes)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `, [rfqId, user.companyId || null, user.id, data.price, data.deliveryDays, data.notes || null]);

            this.logger.log(`💰 Cotización enviada para RFQ ${rfqId}`);

            return { cotizacion: result.rows[0], mensaje: 'Cotización enviada exitosamente' };
        } finally {
            client.release();
        }
    }

    async acceptQuote(rfqId: string, quoteId: string, token: string) {
        const user = this.getUserFromToken(token);
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            // Verify ownership
            const rfq = await client.query(
                'SELECT * FROM rfqs WHERE id = $1 AND requester_id = $2',
                [rfqId, user.id]
            );

            if (rfq.rows.length === 0) {
                throw new HttpException('No autorizado', HttpStatus.FORBIDDEN);
            }

            // Accept this quote
            await client.query(
                'UPDATE rfq_quotes SET status = $1 WHERE id = $2',
                ['accepted', quoteId]
            );

            // Reject others
            await client.query(
                'UPDATE rfq_quotes SET status = $1 WHERE rfq_id = $2 AND id != $3',
                ['rejected', rfqId, quoteId]
            );

            // Close RFQ
            await client.query(
                'UPDATE rfqs SET status = $1, updated_at = NOW() WHERE id = $2',
                ['closed', rfqId]
            );

            await client.query('COMMIT');

            return { mensaje: 'Cotización aceptada exitosamente' };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}
