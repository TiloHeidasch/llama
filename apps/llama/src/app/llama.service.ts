import { Injectable } from '@angular/core';
import { Llama } from '@llama/api-interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LlamaService {

  constructor(private http: HttpClient) { }

  async getAllLlamas(): Promise<Llama[]> {
    return await this.http.get<Llama[]>('/api/llama').toPromise();
  }
  async postNewLlama(llama: Llama): Promise<Llama> {
    return await this.http.put<Llama>('/api/llama', llama).toPromise();
  }
}
