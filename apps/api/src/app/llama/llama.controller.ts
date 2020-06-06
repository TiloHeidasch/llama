import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Llama, CreateLlama, Item, CreateItem } from '@llama/api-interfaces';
import { LlamaService } from './llama.service';

@Controller('llama')
@ApiTags('llama')
export class LlamaController {
    constructor(private service: LlamaService) { }
    @Get()
    async getAllLlamas(): Promise<Llama[]> {
        return await this.service.getAllLlamas();
    }
    @Post()
    async createNewLlama(@Body() createLlama: CreateLlama): Promise<Llama> {
        return await this.service.addNewLlama(createLlama.name);
    }
    @Put()
    async updateOrCreateLlama(@Body() llama: Llama): Promise<Llama> {
        return await this.service.updateOrCreateLlama(llama);
    }
    @Get(':llamaId')
    async getLlamaById(@Param('llamaId') llamaId: string): Promise<Llama> {
        return await this.service.getLlamaById(llamaId);
    }
    @Delete(':llamaId')
    async deleteLlamaById(@Param('llamaId') llamaId: string): Promise<void> {
        await this.service.deleteLlamaById(llamaId);
    }
    @Post(':llamaId/item')
    async createItem(@Param('llamaId') llamaId: string, @Body() createItem: CreateItem): Promise<Item> {
        return await this.service.addNewItem(llamaId, createItem.name, createItem.amount, createItem.unit, createItem.done);
    }
    @Put(':llamaId/item')
    async updateOrCreateItem(@Param('llamaId') llamaId: string, @Body() item: Item): Promise<Item> {
        return await this.service.updateOrCreateItem(llamaId, item);
    }
    @Get(':llamaId/item/:itemId')
    async getItemById(@Param('llamaId') llamaId: string, @Param('itemId') itemId: string): Promise<Item> {
        return await this.service.getItemById(llamaId, itemId);
    }
    @Delete(':llamaId/item/:itemId')
    async deleteItemById(@Param('llamaId') llamaId: string, @Param('itemId') itemId: string): Promise<void> {
        await this.service.deleteItemById(llamaId, itemId);
    }
}
