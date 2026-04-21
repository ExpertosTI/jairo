import { Controller, Post, Body, Get, Request, HttpException, HttpStatus, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Response } from 'express';

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
    async registro(@Body() body: {
        email: string;
        password: string;
        nombre: string;
        empresaId?: string;
    }) {
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
    async logout(@Body() body: { token: string }) {
        return { mensaje: 'Sesión cerrada exitosamente' };
    }

    // Google OAuth - Standard Passport Flow
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Request() req: any) {
        // Redirigirá automáticamente a Google
    }

    // Google OAuth callback
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Request() req: any, @Res() res: Response) {
        try {
            const user = req.user;
            if (!user) {
                return res.redirect('https://jairoapp.renace.tech/login?error=oauth_failed');
            }

            // Generate JWT token
            const { token } = await this.authService.loginGoogle(user);

            // Redirect to frontend callback
            res.redirect(`https://jairoapp.renace.tech/auth/callback?token=${token}`);
        } catch (error: any) {
            console.error('Google OAuth error:', error);
            res.redirect(`https://jairoapp.renace.tech/auth/callback?error=oauth_failed&details=${encodeURIComponent(error.message || 'Unknown error')}`);
        }
    }
}
