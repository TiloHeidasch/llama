import { Controller, Get, Param, Post, Body, Put, Delete, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Category, CreateCategory } from '@llama/api-interfaces';
import { CategoryService } from './category.service';

@Controller('category')
@ApiTags('category')
export class CategoryController {
    private readonly logger = new Logger(CategoryController.name);
    constructor(private service: CategoryService) { }
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
    @Get(':itemName')
    async getCategoryForItemName(@Param('itemName') itemName: string): Promise<Category> {
        return await this.service.getCategoryForItemName(itemName);
    }
}
