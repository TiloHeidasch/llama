import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Llama, Item, ItemCategory } from '@llama/api-interfaces';

@Component({
  selector: 'llama-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  llamas: Llama[] = [{ name: 'first', created: new Date() }, { name: 'second', created: new Date() }];
  activeLlama: Llama = this.llamas[0];
  fuse: boolean = false;
  editLlamaNameMode: boolean = false;
  activeLlamaId: number = 0;
  //hello$ = this.http.get<Message>('/api/hello');
  constructor(private http: HttpClient) { }
  addNewLlama() {
    const newLlama: Llama = { name: 'New Llama', created: new Date() };
    this.llamas.push(newLlama);
    this.activeLlama = newLlama;
    this.activeLlamaId = this.llamas.length - 1;
    //TODO: push new Llama to remote
  }
  addItem() { }
  categories() { }
  select(llama, id) {
    this.activeLlama = llama; this.activeLlamaId = id;
  }
  editName() {
    this.fuse = false;
    setTimeout(() => { this.fuse = true; }, 100);
    this.editLlamaNameMode = true;
  }
  stopEdit() {
    if (this.fuse) {
      this.editLlamaNameMode = false;
      //TODO Update name on remote
    }
  }
}
