import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, CreateCategory } from '@llama/api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }
  async getAllCategories(): Promise<Category[]> {
    let categories: Category[] = await (await this.http.get<Category[]>('/api/category').toPromise()).sort((category1, category2) => (new Date(category1.created).getTime() - new Date(category2.created).getTime()));
    return categories;
  }
  async addCategory(name: string): Promise<Category> {
    const createCategory: CreateCategory = { name };
    return await this.http.post<Category>('/api/category', createCategory).toPromise();
  }
  async getAllItemNames(): Promise<string[]> {
    let itemNames: string[] = await (await this.http.get<string[]>('/api/itemName').toPromise()).sort((itemName1, itemName2) => {
      if (itemName1 > itemName2) return 1;
      if (itemName1 < itemName2) return -1;
      return 0;
    });
    return itemNames;
  }
  async getUncategorizedItemNames(): Promise<string[]> {
    let uncategorizedItemNames: string[] = await (await this.http.get<string[]>('/api/itemName/uncategorized').toPromise()).sort((itemName1, itemName2) => {
      if (itemName1 > itemName2) return 1;
      if (itemName1 < itemName2) return -1;
      return 0;
    });
    return uncategorizedItemNames;
  }
  async updateCategory(category: Category): Promise<Category> {
    return await this.http.put<Category>('/api/category', category).toPromise();
  }

}
