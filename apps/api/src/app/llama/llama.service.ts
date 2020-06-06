import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Llama } from '@llama/api-interfaces';
import { promisify } from 'util';
import { exists, readFile, writeFile } from 'fs';

@Injectable()
export class LlamaService {
    private readonly filePath = 'data/llamas.json';
    private readonly logger = new Logger(LlamaService.name);

    async getAllLlamas(): Promise<Llama[]> {
        const file = await this.loadFile();
        return file.llamas;
    }
    async getLlamaById(id: string): Promise<Llama> {
        const file = await this.loadFile();
        const llama: Llama = file.llamas.find(llama => llama.id === id);
        if (llama === undefined) {
            console.log(file);
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
    async addLlama(llama: Llama): Promise<Llama> {
        const file = await this.loadFile();
        file.llamas.push(llama);
        await promisify(writeFile)(this.filePath, JSON.stringify(file, undefined, 2));
        return llama;
    }
    async updateLlama(llama: Llama) {
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
