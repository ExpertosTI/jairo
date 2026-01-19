import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Pool } from 'pg';
import * as jwt from 'jsonwebtoken';
import { EmailService } from './email.service';

export type NotificationType =
    | 'connection_request'
    | 'connection_accepted'
    | 'new_message'
    | 'rfq_received'
    | 'rfq_quote'
    | 'rfq_accepted'
    | 'profile_view'
    | 'system';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    private pool: Pool;
    private readonly jwtSecret = process.env.JWT_SECRET;

    constructor(private readonly emailService: EmailService) {
        this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
        this.initTables();
    }

    private async initTables() {
        const client = await this.pool.connect();
        try {
            await client.query(`
                CREATE TABLE IF NOT EXISTS notifications (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id UUID NOT NULL,
                    type VARCHAR(50) NOT NULL,
                    title VARCHAR(300) NOT NULL,
                    message TEXT,
                    link VARCHAR(500),
                    data JSONB,
                    read_at TIMESTAMP,
                    created_at TIMESTAMP DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS notification_preferences (
                    user_id UUID PRIMARY KEY,
                    email_connections BOOLEAN DEFAULT true,
                    email_messages BOOLEAN DEFAULT true,
                    email_rfqs BOOLEAN DEFAULT true,
                    push_enabled BOOLEAN DEFAULT true,
                    updated_at TIMESTAMP DEFAULT NOW()
                );

                CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);
                CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;
            `);
            this.logger.log('✅ Notifications tables initialized');
        } catch (error) {
            this.logger.warn('Notifications tables may already exist');
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

    async create(userId: string, type: NotificationType, title: string, message?: string, link?: string, data?: any) {
        const client = await this.pool.connect();

        try {
            const result = await client.query(`
                INSERT INTO notifications (user_id, type, title, message, link, data)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `, [userId, type, title, message, link, data ? JSON.stringify(data) : null]);

            // Check if should send email
            const prefs = await client.query(
                'SELECT * FROM notification_preferences WHERE user_id = $1',
                [userId]
            );

            if (prefs.rows.length > 0) {
                const p = prefs.rows[0];
                let shouldEmail = false;

                if (type.includes('connection') && p.email_connections) shouldEmail = true;
                if (type.includes('message') && p.email_messages) shouldEmail = true;
                if (type.includes('rfq') && p.email_rfqs) shouldEmail = true;

                if (shouldEmail) {
                    const user = await client.query('SELECT email, name FROM users WHERE id = $1', [userId]);
                    if (user.rows.length > 0) {
                        await this.emailService.sendEmail(
                            user.rows[0].email,
                            `JairoApp: ${title}`,
                            `<h2>Hola ${user.rows[0].name}</h2><p>${message}</p>`
                        );
                    }
                }
            }

            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async getNotifications(token: string) {
        const user = this.getUserFromToken(token);
        const client = await this.pool.connect();

        try {
            const result = await client.query(`
                SELECT *
                FROM notifications
                WHERE user_id = $1
                ORDER BY created_at DESC
                LIMIT 100
            `, [user.id]);

            return { notificaciones: result.rows };
        } finally {
            client.release();
        }
    }

    async markAsRead(id: string, token: string) {
        const user = this.getUserFromToken(token);
        const client = await this.pool.connect();

        try {
            await client.query(
                'UPDATE notifications SET read_at = NOW() WHERE id = $1 AND user_id = $2',
                [id, user.id]
            );
            return { success: true };
        } finally {
            client.release();
        }
    }

    async markAllAsRead(token: string) {
        const user = this.getUserFromToken(token);
        const client = await this.pool.connect();

        try {
            await client.query(
                'UPDATE notifications SET read_at = NOW() WHERE user_id = $1 AND read_at IS NULL',
                [user.id]
            );
            return { success: true };
        } finally {
            client.release();
        }
    }

    async getUnreadCount(token: string) {
        const user = this.getUserFromToken(token);
        const client = await this.pool.connect();

        try {
            const result = await client.query(
                'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND read_at IS NULL',
                [user.id]
            );
            return { unread: parseInt(result.rows[0].count) };
        } finally {
            client.release();
        }
    }

    async updatePreferences(token: string, prefs: any) {
        const user = this.getUserFromToken(token);
        const client = await this.pool.connect();

        try {
            await client.query(`
                INSERT INTO notification_preferences (user_id, email_connections, email_messages, email_rfqs, push_enabled)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (user_id) DO UPDATE SET
                    email_connections = COALESCE($2, notification_preferences.email_connections),
                    email_messages = COALESCE($3, notification_preferences.email_messages),
                    email_rfqs = COALESCE($4, notification_preferences.email_rfqs),
                    push_enabled = COALESCE($5, notification_preferences.push_enabled),
                    updated_at = NOW()
            `, [
                user.id,
                prefs.emailConnections ?? true,
                prefs.emailMessages ?? true,
                prefs.emailRfqs ?? true,
                prefs.pushEnabled ?? true
            ]);

            return { mensaje: 'Preferencias actualizadas' };
        } finally {
            client.release();
        }
    }
}
