import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
    private readonly logger = new Logger(SeedService.name);
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }

    async onModuleInit() {
        await this.initDatabase();
        await this.createSuperAdmins();
    }

    async initDatabase() {
        const client = await this.pool.connect();
        try {
            // Crear enum si no existe
            await client.query(`
        DO $$ BEGIN
          CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'manager', 'user');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

            await client.query(`
        DO $$ BEGIN
          CREATE TYPE company_status AS ENUM ('active', 'pending', 'suspended');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

            // Crear tabla de usuarios si no existe
            await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(200),
          role user_role DEFAULT 'user',
          company_id UUID,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

            // Crear tabla de sectores
            await client.query(`
        CREATE TABLE IF NOT EXISTS sectors (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL,
          description TEXT,
          icon VARCHAR(50),
          color VARCHAR(7),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

            // Crear tabla de tipos de empresa
            await client.query(`
        CREATE TABLE IF NOT EXISTS company_types (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL,
          description TEXT,
          sector_id UUID REFERENCES sectors(id),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

            // Crear tabla de empresas
            await client.query(`
        CREATE TABLE IF NOT EXISTS companies (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(200) NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL,
          logo VARCHAR(500),
          sector_id UUID REFERENCES sectors(id),
          type_id UUID REFERENCES company_types(id),
          address TEXT,
          phone VARCHAR(20),
          email VARCHAR(100),
          website VARCHAR(200),
          status company_status DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

            this.logger.log('✅ Base de datos inicializada');
        } catch (error) {
            this.logger.error('❌ Error inicializando base de datos:', error);
        } finally {
            client.release();
        }
    }

    async createSuperAdmins() {
        const superAdmins = [
            {
                email: process.env.SUPER_ADMIN_EMAIL_1 || 'adavidfc@hotmail.com',
                name: 'Angel David Flores'
            },
            {
                email: process.env.SUPER_ADMIN_EMAIL_2 || 'expertostird@gmail.com',
                name: 'Adderly Marte'
            },
        ];

        const client = await this.pool.connect();
        try {
            for (const admin of superAdmins) {
                const existing = await client.query(
                    'SELECT id FROM users WHERE email = $1',
                    [admin.email]
                );

                if (existing.rows.length === 0) {
                    const hashedPassword = await bcrypt.hash('JairoApp2026!', 10);

                    await client.query(
                        `INSERT INTO users (email, name, password, role) VALUES ($1, $2, $3, 'super_admin')`,
                        [admin.email, admin.name, hashedPassword]
                    );

                    this.logger.log(`✅ Super Admin creado: ${admin.email}`);
                } else {
                    this.logger.log(`ℹ️ Super Admin ya existe: ${admin.email}`);
                }
            }
        } catch (error) {
            this.logger.error('❌ Error creando super admins:', error);
        } finally {
            client.release();
        }
    }
}
