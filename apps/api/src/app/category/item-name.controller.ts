import { Controller, Get, Param, Post, Body, Put, Delete, Logger, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Category, CreateCategory, Llama } from '@llama/api-interfaces';
import { CategoryService } from './category.service';
import { LlamaService } from '../llama/llama.service';

@Controller('itemName')
@ApiTags('itemName')
export class ItemNameController {
    private readonly logger = new Logger(ItemNameController.name);
    constructor(private service: CategoryService, private llamaService: LlamaService) { }
    @Get('/category/:itemName')
    async getCategoryForItemName(@Param('itemName') itemName: string): Promise<Category> {
        const category: Category = await this.service.getCategoryForItemName(itemName);
        if (category === undefined) {
            throw new NotFoundException('No category found for item with name ' + itemName);
        }
        return category;
    }
    @Get()
    async getAllItemNames(): Promise<string[]> {
        const llamas: Llama[] = await this.llamaService.getAllLlamas();
        const itemNames: string[] = [];
        for (let index = 0; index < llamas.length; index++) {
            const llama = llamas[index];
            for (let itemIndex = 0; itemIndex < llama.items.length; itemIndex++) {
                const item = llama.items[itemIndex];
                if (itemNames.find(string => string === item.name) === undefined) {
                    itemNames.push(item.name);
                }
            }
        }
        return itemNames;
    }
    @Get('/uncategorized')
    async getAllUncategorizedItemNames(): Promise<string[]> {
        const itemNames: string[] = await this.getAllItemNames();
        const uncategorized: string[] = [];
        for (let index = 0; index < itemNames.length; index++) {
            const itemName = itemNames[index];
            const category: Category = await this.service.getCategoryForItemName(itemName);
            if (category === undefined) {
                uncategorized.push(itemName);
            }
        }
        return uncategorized;
    }
}
