import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Llama, CreateLlama } from '@llama/api-interfaces';
import { LlamaService } from './llama.service';

@Controller('llama')
@ApiTags('llama')
export class LlamaController {
    constructor(private service: LlamaService) { }
    @Get()
    async getAllLlamas(): Promise<Llama[]> {
        return await this.service.getAllLlamas();
    }
    @Get(':id')
    async getLlamaById(@Param('id') id: string): Promise<Llama> {
        return await this.service.getLlamaById(id);
    }
    @Post()
    async createNewLlama(@Body() createLlama: CreateLlama): Promise<Llama> {
        return await this.service.addNewLlama(createLlama.name);
    }
    @Put()
    async updateOrCreateLlama(@Body() llama: Llama): Promise<Llama> {
        return await this.service.updateOrCreateLlama(llama);
    }
}
