import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class CompaniesService {
    private readonly logger = new Logger(CompaniesService.name);
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }

    async findAll(filters: { sector?: string; tipo?: string; estado?: string; busqueda?: string }) {
        const client = await this.pool.connect();
        try {
            let query = `
        SELECT 
          c.*,
          s.name as sector_nombre,
          ct.name as tipo_nombre,
          (SELECT COUNT(*) FROM company_relationships WHERE company_a_id = c.id OR company_b_id = c.id) as conexiones
        FROM companies c
        LEFT JOIN sectors s ON c.sector_id = s.id
        LEFT JOIN company_types ct ON c.type_id = ct.id
        WHERE 1=1
      `;
            const params: any[] = [];
            let paramIndex = 1;

            if (filters.busqueda) {
                query += ` AND (c.name ILIKE $${paramIndex} OR c.email ILIKE $${paramIndex})`;
                params.push(`%${filters.busqueda}%`);
                paramIndex++;
            }

            if (filters.sector) {
                query += ` AND s.name = $${paramIndex}`;
                params.push(filters.sector);
                paramIndex++;
            }

            if (filters.estado) {
                query += ` AND c.status = $${paramIndex}`;
                params.push(filters.estado);
                paramIndex++;
            }

            query += ` ORDER BY c.created_at DESC`;

            const result = await client.query(query, params);
            return { empresas: result.rows, total: result.rowCount };
        } finally {
            client.release();
        }
    }

    async findOne(id: string) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT 
          c.*,
          s.name as sector_nombre,
          ct.name as tipo_nombre
        FROM companies c
        LEFT JOIN sectors s ON c.sector_id = s.id
        LEFT JOIN company_types ct ON c.type_id = ct.id
        WHERE c.id = $1
      `, [id]);

            if (result.rows.length === 0) {
                throw new NotFoundException('Empresa no encontrada');
            }

            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async create(data: any) {
        const client = await this.pool.connect();
        try {
            const slug = data.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

            const result = await client.query(`
        INSERT INTO companies (name, slug, email, phone, address, website, sector_id, type_id, logo, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
        RETURNING *
      `, [
                data.nombre,
                slug,
                data.email,
                data.telefono,
                data.direccion,
                data.website,
                data.sectorId,
                data.tipoId,
                data.logo
            ]);

            // Registrar actividad
            await this.registrarActividad('nueva_empresa', result.rows[0].id, `Nueva empresa registrada: ${data.nombre}`);

            this.logger.log(`✅ Empresa creada: ${data.nombre}`);
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async update(id: string, data: any) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        UPDATE companies 
        SET name = COALESCE($2, name),
            email = COALESCE($3, email),
            phone = COALESCE($4, phone),
            address = COALESCE($5, address),
            website = COALESCE($6, website),
            sector_id = COALESCE($7, sector_id),
            type_id = COALESCE($8, type_id),
            status = COALESCE($9, status),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [id, data.nombre, data.email, data.telefono, data.direccion, data.website, data.sectorId, data.tipoId, data.estado]);

            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async remove(id: string) {
        const client = await this.pool.connect();
        try {
            await client.query('DELETE FROM company_relationships WHERE company_a_id = $1 OR company_b_id = $1', [id]);
            await client.query('DELETE FROM companies WHERE id = $1', [id]);
            return { mensaje: 'Empresa eliminada exitosamente' };
        } finally {
            client.release();
        }
    }

    async solicitarConexion(empresaOrigenId: string, empresaDestinoId: string, tipo: string) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        INSERT INTO company_relationships (company_a_id, company_b_id, relationship_type, status)
        VALUES ($1, $2, $3, 'pending')
        RETURNING *
      `, [empresaOrigenId, empresaDestinoId, tipo]);

            await this.registrarActividad('solicitud_conexion', empresaOrigenId, `Solicitud de conexión enviada`);

            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async getConexiones(empresaId: string) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT 
          cr.*,
          ca.name as empresa_origen_nombre,
          cb.name as empresa_destino_nombre
        FROM company_relationships cr
        JOIN companies ca ON cr.company_a_id = ca.id
        JOIN companies cb ON cr.company_b_id = cb.id
        WHERE cr.company_a_id = $1 OR cr.company_b_id = $1
      `, [empresaId]);

            return result.rows;
        } finally {
            client.release();
        }
    }

    private async registrarActividad(tipo: string, empresaId: string, descripcion: string) {
        const client = await this.pool.connect();
        try {
            await client.query(`
        INSERT INTO activities (type, company_id, description) VALUES ($1, $2, $3)
      `, [tipo, empresaId, descripcion]);
        } catch (error) {
            // Tabla puede no existir aún
            this.logger.warn('No se pudo registrar actividad:', error);
        } finally {
            client.release();
        }
    }
}
