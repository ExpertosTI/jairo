import { Controller, Post, Body, Get, Request, HttpException, HttpStatus, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { FastifyReply } from 'fastify';

const GOOGLE_CALLBACK_URL = 'https://jairoapp.renace.tech/api/auth/google/callback';
const FRONTEND_CALLBACK_URL = 'https://jairoapp.renace.tech/auth/callback';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        if (!body.email || !body.password) {
            throw new HttpException('Email y contraseña son requeridos', HttpStatus.BAD_REQUEST);
        }
        return this.authService.login(body.email, body.password);
    }

    @Post('registro')
    async registro(@Body() body: { email: string; password: string; nombre: string; empresaId?: string }) {
        if (!body.email || !body.password || !body.nombre) {
            throw new HttpException('Email, contraseña y nombre son requeridos', HttpStatus.BAD_REQUEST);
        }
        return this.authService.registro(body);
    }

    @Post('recuperar')
    async recuperarPassword(@Body() body: { email: string }) {
        return this.authService.enviarRecuperacion(body.email);
    }

    @Post('cambiar-password')
    async cambiarPassword(@Body() body: { token: string; nuevaPassword: string }) {
        return this.authService.cambiarPassword(body.token, body.nuevaPassword);
    }

    @Get('perfil')
    async getPerfil(@Request() req: any) {
        return this.authService.getPerfil(req.user?.id);
    }

    @Post('logout')
    async logout() {
        return { mensaje: 'Sesión cerrada exitosamente' };
    }

    // ── Google OAuth2 (manual flow — Fastify compatible) ─────────────────────

    @Get('google')
    async googleAuth(@Res() res: FastifyReply) {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId || clientId === 'not_set' || !clientId.trim()) {
            return res.status(503).send({ statusCode: 503, message: 'Google OAuth no está configurado en este servidor' });
        }

        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: GOOGLE_CALLBACK_URL,
            response_type: 'code',
            scope: 'email profile',
            access_type: 'offline',
            prompt: 'select_account',
        });

        return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
    }

    @Get('google/callback')
    async googleCallback(
        @Query('code') code: string,
        @Query('error') oauthError: string,
        @Res() res: FastifyReply,
    ) {
        if (oauthError || !code) {
            return res.redirect(`${FRONTEND_CALLBACK_URL}?error=oauth_cancelled`);
        }

        try {
            const clientId = process.env.GOOGLE_CLIENT_ID!;
            const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

            // Exchange authorization code for tokens
            const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: GOOGLE_CALLBACK_URL,
                    grant_type: 'authorization_code',
                }).toString(),
            });

            const tokens = await tokenRes.json() as any;
            if (!tokens.access_token) {
                return res.redirect(`${FRONTEND_CALLBACK_URL}?error=token_exchange_failed`);
            }

            // Fetch Google user profile
            const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            });
            const profile = await profileRes.json() as any;

            if (!profile.email) {
                return res.redirect(`${FRONTEND_CALLBACK_URL}?error=profile_unavailable`);
            }

            const user = await this.authService.validateGoogleUser({
                email: profile.email,
                firstName: profile.given_name || '',
                lastName: profile.family_name || '',
                picture: profile.picture || '',
            });

            const { token } = await this.authService.loginGoogle(user);
            return res.redirect(`${FRONTEND_CALLBACK_URL}?token=${token}`);
        } catch (error: any) {
            console.error('Google OAuth callback error:', error?.message);
            return res.redirect(`${FRONTEND_CALLBACK_URL}?error=oauth_failed`);
        }
    }
}
