import { Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ActivitiesService {
    private readonly logger = new Logger(ActivitiesService.name);
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }

    async findAll(limite: number = 20) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT 
          a.*,
          c.name as empresa_nombre,
          c.logo as empresa_logo
        FROM activities a
        LEFT JOIN companies c ON a.company_id = c.id
        ORDER BY a.created_at DESC
        LIMIT $1
      `, [limite]);
            return { actividades: result.rows };
        } finally {
            client.release();
        }
    }

    async getRecientes() {
        return this.findAll(10);
    }

    async create(tipo: string, empresaId: string | null, descripcion: string) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        INSERT INTO activities (type, company_id, description)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [tipo, empresaId, descripcion]);
            return result.rows[0];
        } finally {
            client.release();
        }
    }
}
