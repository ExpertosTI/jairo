import { Injectable, OnModuleInit } from '@nestjs/common';
import { db, users, userRoleEnum } from '@repo/database';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
    async onModuleInit() {
        await this.createSuperAdmins();
    }

    async createSuperAdmins() {
        const superAdmins = [
            { email: process.env.SUPER_ADMIN_EMAIL_1 || 'adavidfc@hotmail.com', name: 'Adderly Marte' },
            { email: process.env.SUPER_ADMIN_EMAIL_2 || 'expertostird@gmail.com', name: 'Expertos TI' },
        ];

        for (const admin of superAdmins) {
            try {
                const existing = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, admin.email))
                    .limit(1);

                if (existing.length === 0) {
                    const hashedPassword = await bcrypt.hash('JairoApp2026!', 10);

                    await db.insert(users).values({
                        email: admin.email,
                        name: admin.name,
                        password: hashedPassword,
                        role: 'super_admin',
                    });

                    console.log(`✅ Super Admin creado: ${admin.email}`);
                } else {
                    console.log(`ℹ️ Super Admin ya existe: ${admin.email}`);
                }
            } catch (error) {
                console.error(`❌ Error creando super admin ${admin.email}:`, error);
            }
        }
    }
}
