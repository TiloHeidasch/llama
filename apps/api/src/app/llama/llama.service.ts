import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Llama, ItemCategory, Item } from '@llama/api-interfaces';
import { promisify } from 'util';
import { exists, readFile, writeFile } from 'fs';

@Injectable()
export class LlamaService {
    private readonly filePath = 'data/llamas.json';
    private readonly logger = new Logger(LlamaService.name);

    async getAllLlamas(): Promise<Llama[]> {
        const file = await this.loadFile();
        return file.llamas.sort((llama1, llama2) => (new Date(llama1.created).getTime() - new Date(llama2.created).getTime()));
    }
    async getLlamaById(id: string): Promise<Llama> {
        const llamas: Llama[] = await this.getAllLlamas();
        const llama: Llama = llamas.find(llama => llama.id === id);
        if (llama === undefined) {
            throw new NotFoundException('Llama with id ' + id + ' not found');
        }
        return llama;
    }
    async addNewLlama(name: string): Promise<Llama> {
        const llama: Llama = new Llama(name);
        const file = await this.loadFile();
        file.llamas.push(llama);
        await promisify(writeFile)(this.filePath, JSON.stringify(file, undefined, 2));
        return llama;
    }
    private async updateLlama(llama: Llama) {
        const file = await this.loadFile();
        file.llamas = file.llamas.filter(llamaInFile => llamaInFile.id !== llama.id);
        file.llamas.push(llama);
        await promisify(writeFile)(this.filePath, JSON.stringify(file, undefined, 2));
    }
    async updateOrCreateLlama(newLlama: Llama): Promise<Llama> {
        try {
            //check if it exists
            await this.getLlamaById(newLlama.id);
            await this.updateLlama(newLlama);
            return newLlama;
        } catch (error) {
            //if it doesn't exist we have to create a new one
            const llama: Llama = await this.addLlama(newLlama);
            return await this.getLlamaById(llama.id);
        }
    }
    async deleteLlamaById(id: string) {
        const llama: Llama = await this.getLlamaById(id);
        this.deleteLlama(llama);
    }
    private async addLlama(llama: Llama): Promise<Llama> {
        const file = await this.loadFile();
        file.llamas.push(llama);
        await promisify(writeFile)(this.filePath, JSON.stringify(file, undefined, 2));
        return llama;
    }
    private async deleteLlama(llama: Llama) {
        const file = await this.loadFile();
        file.llamas = file.llamas.filter(otherLlama => otherLlama.id != llama.id);
        await promisify(writeFile)(this.filePath, JSON.stringify(file, undefined, 2));
    }
    async getItemById(llamaId: string, id: string): Promise<Item> {
        const llama: Llama = await this.getLlamaById(llamaId);

        const item: Item = llama.items.find(item => item.id === id);
        if (item === undefined) {
            throw new NotFoundException('Llama with id ' + llamaId + 'does not contain Item with id ' + id);
        }
        return item;
    }
    async addNewItem(id: string, name: string, amount: string, unit: string, done: boolean): Promise<Item> {
        const llama: Llama = await this.getLlamaById(id);
        const item: Item = new Item(name, amount, unit, done)
        llama.items.push(item);
        await this.updateLlama(llama);
        return item;
    }
    async updateOrCreateItem(llamaId: string, newItem: Item): Promise<Item> {
        try {
            //check if it exists
            await this.getItemById(llamaId, newItem.id);
            await this.updateItem(llamaId, newItem);
            return newItem;
        } catch (error) {
            //if it doesn't exist we have to create a new one
            return await this.addNewItem(llamaId, newItem.name, newItem.amount, newItem.unit, newItem.done);
        }
    }
    async deleteItemById(llamaId: string, id: string) {
        const llama: Llama = await this.getLlamaById(id);
        llama.items = llama.items.filter(item => item.id !== id);
        this.updateLlama(llama);
    }
    private async updateItem(llamaId: string, item: Item) {
        const llama: Llama = await this.getLlamaById(llamaId);
        const itemToUpdate: Item = llama.items.find(otherItem => otherItem.id === item.id);
        itemToUpdate.name = item.name;
        itemToUpdate.amount = item.amount;
        itemToUpdate.unit = item.unit;
        itemToUpdate.done = item.done;
        await this.updateLlama(llama);
    }
    private async loadFile(): Promise<{ llamas: Llama[] }> {
        try {
            if (await this.fileExists()) {
                const buffer = await promisify(readFile)(this.filePath);
                const llamas = buffer.toString();
                return llamas ? JSON.parse(llamas) : { llamas: [] };
            } else {
                return { llamas: [] };
            }
        } catch (error) {
            this.logger.error(error);
            return { llamas: [] };
        }
    }
    /**
     * Check if the result file exists.
     */
    private async fileExists() {
        return await promisify(exists)(this.filePath);
    }
}
