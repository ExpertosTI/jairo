import { Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DashboardService {
    private readonly logger = new Logger(DashboardService.name);
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }

    async getEstadisticas() {
        const client = await this.pool.connect();
        try {
            // Total empresas
            const empresas = await client.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'active') as activas,
          COUNT(*) FILTER (WHERE status = 'pending') as pendientes,
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as nuevas_semana
        FROM companies
      `);

            // Total usuarios
            const usuarios = await client.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE role = 'super_admin') as super_admins,
          COUNT(*) FILTER (WHERE role = 'admin') as admins,
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as nuevos_semana
        FROM users
      `);

            // Total conexiones
            const conexiones = await client.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'active') as activas,
          COUNT(*) FILTER (WHERE status = 'pending') as pendientes
        FROM company_relationships
      `);

            // Total sectores
            const sectores = await client.query('SELECT COUNT(*) as total FROM sectors');

            return {
                empresas: empresas.rows[0],
                usuarios: usuarios.rows[0],
                conexiones: conexiones.rows[0],
                sectores: { total: sectores.rows[0].total }
            };
        } finally {
            client.release();
        }
    }

    async getEmpresasRecientes() {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT c.id, c.name, c.email, c.status, c.created_at,
               s.name as sector_nombre, s.icon as sector_icono
        FROM companies c
        LEFT JOIN sectors s ON c.sector_id = s.id
        ORDER BY c.created_at DESC
        LIMIT 10
      `);
            return { empresas: result.rows };
        } finally {
            client.release();
        }
    }

    async getActividadesRecientes() {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT a.*, 
               c.name as empresa_nombre,
               u.name as usuario_nombre
        FROM activities a
        LEFT JOIN companies c ON a.company_id = c.id
        LEFT JOIN users u ON a.user_id = u.id
        ORDER BY a.created_at DESC
        LIMIT 20
      `);
            return { actividades: result.rows };
        } finally {
            client.release();
        }
    }

    async getSectoresDistribucion() {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT s.id, s.name, s.icon, s.color,
               COUNT(c.id) as total_empresas
        FROM sectors s
        LEFT JOIN companies c ON c.sector_id = s.id
        GROUP BY s.id, s.name, s.icon, s.color
        ORDER BY total_empresas DESC
      `);
            return { sectores: result.rows };
        } finally {
            client.release();
        }
    }

    async getConexionesRecientes() {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT cr.*,
               ca.name as empresa_origen,
               cb.name as empresa_destino
        FROM company_relationships cr
        JOIN companies ca ON cr.company_a_id = ca.id
        JOIN companies cb ON cr.company_b_id = cb.id
        ORDER BY cr.created_at DESC
        LIMIT 10
      `);
            return { conexiones: result.rows };
        } finally {
            client.release();
        }
    }
}
