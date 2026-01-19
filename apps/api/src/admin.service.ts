import { Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { EmailService } from './email.service';

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);
    private pool: Pool;

    constructor(private readonly emailService: EmailService) {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }

    async getSystemStats() {
        const client = await this.pool.connect();
        try {
            const users = await client.query('SELECT COUNT(*) FROM users');
            const companies = await client.query('SELECT COUNT(*) FROM companies');
            const rfqs = await client.query('SELECT COUNT(*) FROM rfqs'); // Check table name in seed
            const products = await client.query('SELECT COUNT(*) FROM products');

            // Get recent activity
            const recentUsers = await client.query('SELECT name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5');
            const recentCompanies = await client.query('SELECT name, status, created_at FROM companies ORDER BY created_at DESC LIMIT 5');

            return {
                counts: {
                    users: parseInt(users.rows[0].count),
                    companies: parseInt(companies.rows[0].count),
                    rfqs: parseInt(rfqs.rows[0].count), // Will error if table name wrong, verified in previous turn it is rfqs
                    products: parseInt(products.rows[0].count)
                },
                recent: {
                    users: recentUsers.rows,
                    companies: recentCompanies.rows
                }
            };
        } finally {
            client.release();
        }
    }

    async getPendingCompanies() {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
                SELECT c.*, u.name as admin_name, u.email as admin_email
                FROM companies c
                LEFT JOIN users u ON u.company_id = c.id AND u.role = 'admin'
                WHERE c.status = 'pending'
                ORDER BY c.created_at ASC
            `);
            return result.rows;
        } finally {
            client.release();
        }
    }

    async approveCompany(companyId: string) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            // Update status
            await client.query('UPDATE companies SET status = \'active\' WHERE id = $1', [companyId]);

            // Get company and admin info for email
            const res = await client.query(`
                SELECT c.name, u.email
                FROM companies c
                JOIN users u ON u.company_id = c.id AND u.role = 'admin'
                WHERE c.id = $1
            `, [companyId]);

            await client.query('COMMIT');

            if (res.rows.length > 0) {
                const { name, email } = res.rows[0];
                this.emailService.sendCompanyApproved(email, name).catch(err =>
                    this.logger.error(`Failed to send approval email to ${email}`, err)
                );
            }

            return { message: 'Empresa aprobada' };
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    async rejectCompany(companyId: string) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            // Update status
            await client.query('UPDATE companies SET status = \'suspended\' WHERE id = $1', [companyId]);

            // Get company and admin info for email
            const res = await client.query(`
                SELECT c.name, u.email
                FROM companies c
                JOIN users u ON u.company_id = c.id AND u.role = 'admin'
                WHERE c.id = $1
            `, [companyId]);

            await client.query('COMMIT');

            if (res.rows.length > 0) {
                const { name, email } = res.rows[0];
                this.emailService.sendCompanyRejected(email, name).catch(err =>
                    this.logger.error(`Failed to send rejection email to ${email}`, err)
                );
            }

            return { message: 'Empresa rechazada/suspendida' };
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }
}
