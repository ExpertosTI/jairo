import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }

    async findAll(filters: { empresaId?: string; rol?: string; busqueda?: string }) {
        const client = await this.pool.connect();
        try {
            let query = `
        SELECT u.id, u.email, u.name, u.role, u.avatar, u.created_at,
               c.name as empresa_nombre
        FROM users u
        LEFT JOIN companies c ON u.company_id = c.id
        WHERE 1=1
      `;
            const params: any[] = [];
            let paramIndex = 1;

            if (filters.busqueda) {
                query += ` AND (u.name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
                params.push(`%${filters.busqueda}%`);
                paramIndex++;
            }

            if (filters.empresaId) {
                query += ` AND u.company_id = $${paramIndex}`;
                params.push(filters.empresaId);
                paramIndex++;
            }

            if (filters.rol) {
                query += ` AND u.role = $${paramIndex}`;
                params.push(filters.rol);
                paramIndex++;
            }

            query += ` ORDER BY u.created_at DESC`;

            const result = await client.query(query, params);
            return { usuarios: result.rows, total: result.rowCount };
        } finally {
            client.release();
        }
    }

    async findOne(id: string) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT u.id, u.email, u.name, u.role, u.avatar, u.created_at,
               c.name as empresa_nombre, c.id as empresa_id
        FROM users u
        LEFT JOIN companies c ON u.company_id = c.id
        WHERE u.id = $1
      `, [id]);

            if (result.rows.length === 0) {
                throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
            }

            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async create(data: any) {
        const client = await this.pool.connect();
        try {
            const hashedPassword = await bcrypt.hash(data.password || 'TempPass123!', 10);

            const result = await client.query(`
        INSERT INTO users (email, password, name, role, company_id, avatar)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email, name, role, created_at
      `, [
                data.email.toLowerCase(),
                hashedPassword,
                data.nombre,
                data.rol || 'user',
                data.empresaId || null,
                data.avatar || null
            ]);

            this.logger.log(`✅ Usuario creado: ${data.email}`);
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async update(id: string, data: any) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        UPDATE users 
        SET name = COALESCE($2, name),
            avatar = COALESCE($3, avatar),
            company_id = COALESCE($4, company_id)
        WHERE id = $1
        RETURNING id, email, name, role
      `, [id, data.nombre, data.avatar, data.empresaId]);

            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async remove(id: string) {
        const client = await this.pool.connect();
        try {
            await client.query('DELETE FROM users WHERE id = $1', [id]);
            return { mensaje: 'Usuario eliminado exitosamente' };
        } finally {
            client.release();
        }
    }

    async cambiarRol(id: string, nuevoRol: string) {
        const rolesValidos = ['super_admin', 'admin', 'manager', 'user'];
        if (!rolesValidos.includes(nuevoRol)) {
            throw new HttpException('Rol inválido', HttpStatus.BAD_REQUEST);
        }

        const client = await this.pool.connect();
        try {
            const result = await client.query(
                'UPDATE users SET role = $2 WHERE id = $1 RETURNING id, email, role',
                [id, nuevoRol]
            );
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async asignarEmpresa(userId: string, empresaId: string) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(
                'UPDATE users SET company_id = $2 WHERE id = $1 RETURNING id, email, company_id',
                [userId, empresaId]
            );
            return result.rows[0];
        } finally {
            client.release();
        }
    }
}
