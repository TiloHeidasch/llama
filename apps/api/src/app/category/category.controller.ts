import { Controller, Get, Param, Post, Body, Put, Delete, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Category, CreateCategory, Llama } from '@llama/api-interfaces';
import { CategoryService } from './category.service';
import { get } from 'http';
import { LlamaService } from '../llama/llama.service';

@Controller('category')
@ApiTags('category')
export class CategoryController {
    private readonly logger = new Logger(CategoryController.name);
    constructor(private service: CategoryService, private llamaService: LlamaService) { }
    @Get()
    async getAllCategorys(): Promise<Category[]> {
        return await this.service.getAllCategorys();
    }
    @Post()
    async createNewCategory(@Body() createCategory: CreateCategory): Promise<Category> {
        return await this.service.addNewCategory(createCategory.name);
    }
    @Put()
    async updateOrCreateCategory(@Body() category: Category): Promise<Category> {
        return await this.service.updateOrCreateCategory(category);
    }
    @Get(':categoryId')
    async getCategoryById(@Param('categoryId') categoryId: string): Promise<Category> {
        return await this.service.getCategoryById(categoryId);
    }
    @Delete(':categoryId')
    async deleteCategoryById(@Param('categoryId') categoryId: string): Promise<void> {
        await this.service.deleteCategoryById(categoryId);
    }
}
