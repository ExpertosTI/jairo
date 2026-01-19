import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Pool } from 'pg';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ProductsService {
    private readonly logger = new Logger(ProductsService.name);
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
                CREATE TABLE IF NOT EXISTS products (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    company_id UUID NOT NULL,
                    name VARCHAR(300) NOT NULL,
                    description TEXT,
                    sku VARCHAR(100),
                    price DECIMAL(15,2),
                    min_order_qty INTEGER DEFAULT 1,
                    images TEXT[],
                    category_id UUID,
                    status VARCHAR(50) DEFAULT 'active',
                    views INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS product_categories (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    name VARCHAR(200) NOT NULL,
                    parent_id UUID,
                    icon VARCHAR(50),
                    created_at TIMESTAMP DEFAULT NOW()
                );

                CREATE INDEX IF NOT EXISTS idx_products_company ON products(company_id);
                CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
                CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
            `);
            this.logger.log('✅ Products tables initialized');
        } catch (error) {
            this.logger.warn('Products tables may already exist');
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

    async listProducts(filters: any, page: number = 1) {
        const client = await this.pool.connect();
        const limit = 24;
        const offset = (page - 1) * limit;

        try {
            let query = `
                SELECT 
                    p.*,
                    c.name as company_name,
                    c.slug as company_slug,
                    cat.name as category_name
                FROM products p
                LEFT JOIN companies c ON p.company_id = c.id
                LEFT JOIN product_categories cat ON p.category_id = cat.id
                WHERE p.status = 'active'
            `;
            const params: any[] = [];

            if (filters.companyId) {
                query += ` AND p.company_id = $${params.length + 1}`;
                params.push(filters.companyId);
            }

            if (filters.busqueda) {
                query += ` AND (p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`;
                params.push(`%${filters.busqueda}%`);
            }

            if (filters.minPrice) {
                query += ` AND p.price >= $${params.length + 1}`;
                params.push(filters.minPrice);
            }

            if (filters.maxPrice) {
                query += ` AND p.price <= $${params.length + 1}`;
                params.push(filters.maxPrice);
            }

            query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
            params.push(limit, offset);

            const result = await client.query(query, params);

            // Get total count (separate query for simplicity, or window function)
            // Using window function is better performance-wise usually if not huge, but let's stick to simple count for now to avoid modifying the complexities of the query string logic too much
            let countQuery = `
                SELECT COUNT(*) as total
                FROM products p
                WHERE p.status = 'active'
            `;
            const countParams: any[] = [];

            // Re-apply filters for count
            if (filters.companyId) {
                countQuery += ` AND p.company_id = $${countParams.length + 1}`;
                countParams.push(filters.companyId);
            }
            if (filters.busqueda) {
                countQuery += ` AND (p.name ILIKE $${countParams.length + 1} OR p.description ILIKE $${countParams.length + 1})`;
                countParams.push(`%${filters.busqueda}%`);
            }
            if (filters.minPrice) {
                countQuery += ` AND p.price >= $${countParams.length + 1}`;
                countParams.push(filters.minPrice);
            }
            if (filters.maxPrice) {
                countQuery += ` AND p.price <= $${countParams.length + 1}`;
                countParams.push(filters.maxPrice);
            }

            const countResult = await client.query(countQuery, countParams);

            return {
                productos: result.rows,
                pagina: page,
                limite: limit,
                total: parseInt(countResult.rows[0].total)
            };
        } finally {
            client.release();
        }
    }

    async getProduct(id: string) {
        const client = await this.pool.connect();

        try {
            // Increment views
            await client.query('UPDATE products SET views = views + 1 WHERE id = $1', [id]);

            const result = await client.query(`
                SELECT 
                    p.*,
                    c.name as company_name,
                    c.slug as company_slug,
                    c.email as company_email,
                    c.phone as company_phone,
                    cat.name as category_name
                FROM products p
                LEFT JOIN companies c ON p.company_id = c.id
                LEFT JOIN product_categories cat ON p.category_id = cat.id
                WHERE p.id = $1
            `, [id]);

            if (result.rows.length === 0) {
                throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
            }

            return { producto: result.rows[0] };
        } finally {
            client.release();
        }
    }

    async getMyCatalog(token: string) {
        const user = this.getUserFromToken(token);
        const client = await this.pool.connect();

        try {
            const result = await client.query(`
                SELECT 
                    p.*,
                    cat.name as category_name
                FROM products p
                LEFT JOIN product_categories cat ON p.category_id = cat.id
                WHERE p.company_id = $1
                ORDER BY p.created_at DESC
            `, [user.companyId]);

            return { productos: result.rows };
        } finally {
            client.release();
        }
    }

    async createProduct(token: string, data: any) {
        const user = this.getUserFromToken(token);

        if (!user.companyId) {
            throw new HttpException('Debe tener una empresa asociada', HttpStatus.BAD_REQUEST);
        }

        const client = await this.pool.connect();

        try {
            const result = await client.query(`
                INSERT INTO products (company_id, name, description, sku, price, min_order_qty, images, category_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `, [
                user.companyId,
                data.name,
                data.description || null,
                data.sku || null,
                data.price || null,
                data.minOrderQty || 1,
                data.images || [],
                data.categoryId || null
            ]);

            this.logger.log(`📦 Producto creado: ${data.name}`);

            return { producto: result.rows[0], mensaje: 'Producto creado exitosamente' };
        } finally {
            client.release();
        }
    }

    async updateProduct(id: string, token: string, data: any) {
        const user = this.getUserFromToken(token);
        const client = await this.pool.connect();

        try {
            // Verify ownership
            const existing = await client.query(
                'SELECT * FROM products WHERE id = $1 AND company_id = $2',
                [id, user.companyId]
            );

            if (existing.rows.length === 0) {
                throw new HttpException('Producto no encontrado o sin permiso', HttpStatus.FORBIDDEN);
            }

            const result = await client.query(`
                UPDATE products SET
                    name = COALESCE($1, name),
                    description = COALESCE($2, description),
                    sku = COALESCE($3, sku),
                    price = COALESCE($4, price),
                    min_order_qty = COALESCE($5, min_order_qty),
                    images = COALESCE($6, images),
                    updated_at = NOW()
                WHERE id = $7
                RETURNING *
            `, [data.name, data.description, data.sku, data.price, data.minOrderQty, data.images, id]);

            return { producto: result.rows[0], mensaje: 'Producto actualizado' };
        } finally {
            client.release();
        }
    }

    async deleteProduct(id: string, token: string) {
        const user = this.getUserFromToken(token);
        const client = await this.pool.connect();

        try {
            const result = await client.query(
                'UPDATE products SET status = $1, updated_at = NOW() WHERE id = $2 AND company_id = $3 RETURNING id',
                ['deleted', id, user.companyId]
            );

            if (result.rows.length === 0) {
                throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
            }

            return { mensaje: 'Producto eliminado' };
        } finally {
            client.release();
        }
    }

    async importProducts(token: string, products: any[]) {
        const user = this.getUserFromToken(token);

        if (!user.companyId) {
            throw new HttpException('Debe tener una empresa asociada', HttpStatus.BAD_REQUEST);
        }

        const client = await this.pool.connect();
        let imported = 0;

        try {
            await client.query('BEGIN');

            for (const p of products) {
                await client.query(`
                    INSERT INTO products (company_id, name, description, sku, price, min_order_qty)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [user.companyId, p.name, p.description, p.sku, p.price, p.minOrderQty || 1]);
                imported++;
            }

            await client.query('COMMIT');

            this.logger.log(`📦 ${imported} productos importados`);

            return {
                importados: imported,
                mensaje: `${imported} productos importados exitosamente`
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}
