import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Llama, CreateLlama, Item, CreateItem, LlamaDto, ItemDto, Category } from '@llama/api-interfaces';
import { LlamaService } from './llama.service';
import { CategoryService } from '../category/category.service';

@Controller('llama')
@ApiTags('llama')
export class LlamaController {
    constructor(private service: LlamaService, private categoryService: CategoryService) { }
    @Get()
    async getAllLlamas(): Promise<LlamaDto[]> {
        return await this.llamasToLlamaDtos(await this.service.getAllLlamas());
    }
    @Post()
    async createNewLlama(@Body() createLlama: CreateLlama): Promise<LlamaDto> {
        return await this.llamaToLlamaDto(await this.service.addNewLlama(createLlama.name));
    }
    @Put()
    async updateOrCreateLlama(@Body() llama: Llama): Promise<LlamaDto> {
        return await this.llamaToLlamaDto(await this.service.updateOrCreateLlama(llama));
    }
    @Get(':llamaId')
    async getLlamaById(@Param('llamaId') llamaId: string): Promise<LlamaDto> {
        return await this.llamaToLlamaDto(await this.service.getLlamaById(llamaId));
    }
    @Delete(':llamaId')
    async deleteLlamaById(@Param('llamaId') llamaId: string): Promise<void> {
        await this.service.deleteLlamaById(llamaId);
    }
    @Post(':llamaId/item')
    async createItem(@Param('llamaId') llamaId: string, @Body() createItem: CreateItem): Promise<ItemDto> {
        return await this.itemToItemDto(await this.service.addNewItem(llamaId, createItem.name, createItem.amount, createItem.unit, createItem.done));
    }
    @Put(':llamaId/item')
    async updateOrCreateItem(@Param('llamaId') llamaId: string, @Body() item: Item): Promise<ItemDto> {
        return await this.itemToItemDto(await this.service.updateOrCreateItem(llamaId, item));
    }
    @Get(':llamaId/item/:itemId')
    async getItemById(@Param('llamaId') llamaId: string, @Param('itemId') itemId: string): Promise<ItemDto> {
        return await this.itemToItemDto(await this.service.getItemById(llamaId, itemId));
    }
    @Delete(':llamaId/item/:itemId')
    async deleteItemById(@Param('llamaId') llamaId: string, @Param('itemId') itemId: string): Promise<void> {
        await this.service.deleteItemById(llamaId, itemId);
    }
    private async llamasToLlamaDtos(llamas: Llama[]): Promise<LlamaDto[]> {
        const llamaDtos: LlamaDto[] = [];
        for (let index = 0; index < llamas.length; index++) {
            const llama = llamas[index];
            llamaDtos.push(await this.llamaToLlamaDto(llama));
        }
        return llamaDtos;
    }
    private async llamaToLlamaDto(llama: Llama): Promise<LlamaDto> {
        const itemDtos: ItemDto[] = await this.itemsToItemDtos(llama.items);
        const llamaDto: LlamaDto = { id: llama.id, created: llama.created, name: llama.name, items: itemDtos };
        return llamaDto;
    }
    private async itemsToItemDtos(items: Item[]): Promise<ItemDto[]> {
        const itemDtos: ItemDto[] = [];
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            itemDtos.push(await this.itemToItemDto(item));
        }
        return itemDtos;
    }
    private async itemToItemDto(item: Item): Promise<ItemDto> {
        let category: Category;
        category = await this.categoryService.getCategoryForItemName(item.name);
        const itemDto: ItemDto = {
            id: item.id,
            created: item.created,
            done: item.done,
            name: item.name,
            amount: item.amount,
            unit: item.unit,
            category,
        }
        return itemDto;
    }
}
