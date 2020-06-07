import { Injectable } from '@angular/core';
import { Llama, CreateLlama, Item, CreateItem } from '@llama/api-interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LlamaService {

  constructor(private http: HttpClient) { }

  async getAllLlamas(): Promise<Llama[]> {
    let llamas: Llama[] = await (await this.http.get<Llama[]>('/api/llama').toPromise()).sort((llama1, llama2) => (new Date(llama1.created).getTime() - new Date(llama2.created).getTime()));
    llamas.forEach(llama => {
      llama.items = llama.items.sort((item1, item2) => (new Date(item1.created).getTime() - new Date(item2.created).getTime()));
    });
    return llamas;
  }
  async createNewLlama(name: string): Promise<Llama> {
    const createLlama: CreateLlama = { name };
    return await this.http.post<Llama>('/api/llama', createLlama).toPromise();
  }
  async updateLlama(llama: Llama): Promise<Llama> {
    return await this.http.put<Llama>('/api/llama', llama).toPromise();
  }
  async deleteLlama(llama: Llama) {
    await this.http.delete('/api/llama/' + llama.id).toPromise();
  }
  async createNewItem(llama: Llama, name: string, amount?: string, unit?: string): Promise<Item> {
    const createItem: CreateItem = { name, amount, unit, done: false };
    return await this.http.post<Item>('/api/llama/' + llama.id + '/item', createItem).toPromise();
  }
  async updateItem(llama: Llama, item: Item): Promise<Item> {
    return await this.http.put<Item>('/api/llama/' + llama.id + '/item', item).toPromise();
  }
  async deleteItem(llama: Llama, item: Item) {
    await this.http.delete('/api/llama/' + llama.id + '/item/' + item.id).toPromise();
  }
}
