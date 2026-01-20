
import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;
    private readonly logger = new Logger(DatabaseService.name);

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            // Connection pool configuration for stability
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        this.pool.on('error', (err) => {
            this.logger.error('Unexpected error on idle client', err);
            // Don't exit, let the pool reconnect
        });
    }

    async onModuleInit() {
        try {
            this.logger.log('Connecting to database...');
            const client = await this.pool.connect();
            try {
                const res = await client.query('SELECT NOW()');
                this.logger.log('✅ Database connected successfully: ' + res.rows[0].now);
            } finally {
                client.release();
            }
        } catch (e: any) {
            this.logger.error('❌ Failed to connect to database', e.stack);
            // We don't throw here to allow app to start even if DB is temporarily down,
            // but services depending on it will fail.
        }
    }

    async onModuleDestroy() {
        await this.pool.end();
        this.logger.log('Database connection pool closed');
    }

    async query(text: string, params?: any[]) {
        const start = Date.now();
        try {
            const res = await this.pool.query(text, params);
            // const duration = Date.now() - start;
            // this.logger.debug(`Executed query: ${text} (${duration}ms)`);
            return res;
        } catch (error) {
            this.logger.error(`Query failed: ${text}`, error);
            throw error;
        }
    }

    // Expose the pool directly if needed for transactions
    getPool(): Pool {
        return this.pool;
    }
}
