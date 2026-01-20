import { Controller, Post, Body, Get, UseGuards, Request, HttpException, HttpStatus, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

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

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Request() req: any) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Request() req: any, @Res() res: any) {
        const { token } = await this.authService.loginGoogle(req.user);
        return res.redirect(`https://jairoapp.renace.tech/auth/callback?token=${token}`);
    }
}
