import { Controller, Get, Post, Put, Body, Param, Query, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('usuarios')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(
        @Query('empresa') empresaId?: string,
        @Query('rol') rol?: string,
        @Query('busqueda') busqueda?: string,
    ) {
        return this.usersService.findAll({ empresaId, rol, busqueda });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Post()
    async create(@Body() data: any) {
        return this.usersService.create(data);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: any) {
        return this.usersService.update(id, data);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @Put(':id/rol')
    async cambiarRol(@Param('id') id: string, @Body() body: { rol: string }) {
        return this.usersService.cambiarRol(id, body.rol);
    }

    @Post(':id/invitar')
    async invitarAEmpresa(@Param('id') id: string, @Body() body: { empresaId: string }) {
        return this.usersService.asignarEmpresa(id, body.empresaId);
    }
}
