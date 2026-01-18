import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.hostinger.com',
            port: parseInt(process.env.SMTP_PORT || '465'),
            secure: true, // SSL
            auth: {
                user: process.env.SMTP_USER || 'info@renace.space',
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendEmail(to: string, subject: string, html: string) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_FROM || 'JairoApp <info@renace.space>',
                to,
                subject,
                html,
            });
            console.log('📧 Email enviado:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Error enviando email:', error);
            return { success: false, error };
        }
    }

    async sendWelcomeEmail(email: string, name: string) {
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
          .header { background: #fb7701; padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 30px; }
          .btn { display: inline-block; background: #fb7701; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bienvenido a JairoApp</h1>
          </div>
          <div class="content">
            <h2>Hola ${name}!</h2>
            <p>Tu cuenta ha sido creada exitosamente en la plataforma B2B de JairoApp.</p>
            <p>Ya puedes acceder al panel de administración y comenzar a gestionar tu empresa.</p>
            <a href="https://jairoapp.renace.tech/admin" class="btn">Ir al Panel</a>
          </div>
        </div>
      </body>
      </html>
    `;
        return this.sendEmail(email, '🎉 Bienvenido a JairoApp', html);
    }

    async sendNewCompanyNotification(adminEmail: string, companyName: string) {
        const html = `
      <h2>Nueva empresa registrada</h2>
      <p>La empresa <strong>${companyName}</strong> se ha registrado en JairoApp.</p>
      <a href="https://jairoapp.renace.tech/admin/empresas">Ver en el panel</a>
    `;
        return this.sendEmail(adminEmail, `🏢 Nueva empresa: ${companyName}`, html);
    }
}
