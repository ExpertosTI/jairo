import { Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class SectorsService {
    private readonly logger = new Logger(SectorsService.name);
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }

    async findAll() {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT 
          s.*,
          (SELECT COUNT(*) FROM companies WHERE sector_id = s.id) as total_empresas
        FROM sectors s
        ORDER BY s.name ASC
      `);
            return { sectores: result.rows };
        } finally {
            client.release();
        }
    }

    async findOne(id: string) {
        const client = await this.pool.connect();
        try {
            const result = await client.query('SELECT * FROM sectors WHERE id = $1', [id]);
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async create(data: any) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        INSERT INTO sectors (name, description, icon, color)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [data.nombre, data.descripcion, data.icono, data.color]);

            this.logger.log(`✅ Sector creado: ${data.nombre}`);
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async update(id: string, data: any) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        UPDATE sectors 
        SET name = COALESCE($2, name),
            description = COALESCE($3, description),
            icon = COALESCE($4, icon),
            color = COALESCE($5, color)
        WHERE id = $1
        RETURNING *
      `, [id, data.nombre, data.descripcion, data.icono, data.color]);
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async remove(id: string) {
        const client = await this.pool.connect();
        try {
            await client.query('DELETE FROM sectors WHERE id = $1', [id]);
            return { mensaje: 'Sector eliminado exitosamente' };
        } finally {
            client.release();
        }
    }

    async getTiposBySector(sectorId: string) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT * FROM company_types WHERE sector_id = $1 ORDER BY name ASC
      `, [sectorId]);
            return { tipos: result.rows };
        } finally {
            client.release();
        }
    }
}
