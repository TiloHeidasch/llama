import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Category, Item } from '@llama/api-interfaces';
import { promisify } from 'util';
import { exists, readFile, writeFile } from 'fs';

@Injectable()
export class CategoryService {
    private readonly filePath = 'data/categories.json';
    private readonly logger = new Logger(CategoryService.name);

    async getAllCategorys(): Promise<Category[]> {
        return await (await this.loadFile()).categories;
    }
    async getCategoryById(id: string): Promise<Category> {
        const categories: Category[] = await this.getAllCategorys();
        const category: Category = categories.find(category => category.id === id);
        if (category === undefined) {
            throw new NotFoundException('Category with id ' + id + ' not found');
        }
        return category;
    }
    async addNewCategory(name: string): Promise<Category> {
        const category: Category = new Category(name);
        const file = await this.loadFile();
        file.categories.push(category);
        await promisify(writeFile)(this.filePath, JSON.stringify(file, undefined, 2));
        return category;
    }
    private async updateCategory(category: Category) {
        const file = await this.loadFile();
        file.categories = file.categories.filter(categoryInFile => categoryInFile.id !== category.id);
        file.categories.push(category);
        await promisify(writeFile)(this.filePath, JSON.stringify(file, undefined, 2));
    }
    async updateOrCreateCategory(newCategory: Category): Promise<Category> {
        try {
            //check if it exists
            await this.getCategoryById(newCategory.id);
            await this.updateCategory(newCategory);
            return newCategory;
        } catch (error) {
            //if it doesn't exist we have to create a new one
            const category: Category = await this.addCategory(newCategory);
            return await this.getCategoryById(category.id);
        }
    }
    async deleteCategoryById(id: string) {
        const category: Category = await this.getCategoryById(id);
        this.deleteCategory(category);
    }
    async getCategoryForItemName(itemName: string): Promise<Category> {
        const categories: Category[] = await this.getAllCategorys();
        for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
            const category = categories[categoryIndex];
            for (let itemNameIndex = 0; itemNameIndex < category.itemNames.length; itemNameIndex++) {
                const otherItemName = category.itemNames[itemNameIndex];
                if (otherItemName === itemName) {
                    return category;
                }
            }
        }
        throw new NotFoundException('No category found for item with name ' + itemName);
    }
    private async addCategory(category: Category): Promise<Category> {
        const file = await this.loadFile();
        file.categories.push(category);
        await promisify(writeFile)(this.filePath, JSON.stringify(file, undefined, 2));
        return category;
    }
    private async deleteCategory(category: Category) {
        const file = await this.loadFile();
        file.categories = file.categories.filter(otherCategory => otherCategory.id != category.id);
        await promisify(writeFile)(this.filePath, JSON.stringify(file, undefined, 2));
    }
    private async loadFile(): Promise<{ categories: Category[] }> {
        try {
            if (await this.fileExists()) {
                const buffer = await promisify(readFile)(this.filePath);
                const categories = buffer.toString();
                return categories ? JSON.parse(categories) : { categories: [] };
            } else {
                return { categories: [] };
            }
        } catch (error) {
            this.logger.error(error);
            return { categories: [] };
        }
    }
    /**
     * Check if the result file exists.
     */
    private async fileExists() {
        return await promisify(exists)(this.filePath);
    }
}
