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
  editNameFuse: boolean = false;
  newItemFuse: boolean = false;
  editLlamaNameMode: boolean = false;
  newItemMode: boolean = false;
  activeLlamaId: number = 0;
  newItemString: string = '';
  //hello$ = this.http.get<Message>('/api/hello');
  constructor(private http: HttpClient) { }
  addNewLlama() {
    const newLlama: Llama = { name: 'New Llama', created: new Date() };
    this.llamas.push(newLlama);
    this.activeLlama = newLlama;
    this.activeLlamaId = this.llamas.length - 1;
    //TODO: push new Llama to remote
  }
  addItem() {
    if (!this.newItemMode) {
      this.newItemMode = true;
      this.newItemFuse = false;
      setTimeout(() => { this.newItemFuse = true; }, 100);
    } else {
      this.pushStringToNewItem()
    }
  }
  private pushStringToNewItem() {
    if (this.activeLlama.items === undefined) { this.activeLlama.items = []; }
    this.activeLlama.items.push(this.parseNewItem(this.newItemString));
    this.newItemString = '';
  }
  endNewItemMode() {
    if (this.newItemFuse) {
      if (this.newItemString !== '') {
        this.pushStringToNewItem();
      }
      this.newItemFuse = false;
      this.newItemMode = false;
    }
  }
  parseNewItem(string: string): Item {
    try {
      const amountUnit: string = string.match(this.getAmountUnitRegexp()).toString().trim();
      const amount: string = amountUnit.match(this.getAmountRegexp()).toString().trim();
      const unit: string = amountUnit.replace(amount, '').trim();
      const name: string = string.replace(amountUnit, '').trim();
      const item: Item = { name, amount, unit };
      console.log(item);
      return item;
    } catch (ignored) {
      try {
        const amount: string = string.match(this.getAmountRegexp()).toString().trim();
        const name: string = string.replace(amount, '').trim();
        const item: Item = { name, amount };
        console.log(item);
        return item;
      } catch (ignored) {
        const item: Item = { name: string };
        console.log(item);
        return item;
      }
    }
  }
  private getAmountRegexp(): RegExp {
    const regexp: string = '\\d+|\\d+,\\d+|\\d+\\.\\d+'
    return new RegExp(regexp);
  }
  private getAmountUnitRegexp(): RegExp {
    const units: string[] = [
      'g',
      'G',
      'kg',
      'Kg',
      'stk',
      'Stk',
      'Stück',
      'Packung',
      'Packungen',
      'Pkg',
      'pkg',
    ];
    let regexp: string = '';
    let first: boolean = true;
    units.forEach(unit => {
      if (!first) {
        regexp += '|';
      }
      regexp += '\\d+' + unit + ' ';
      regexp += '|';
      regexp += '\\d+ ' + unit + ' ';
      regexp += '|';
      regexp += '\\d+,\\d+' + unit + ' ';
      regexp += '|';
      regexp += '\\d+,\\d+ ' + unit + ' ';
      regexp += '|';
      regexp += '\\d+\\.\\d+' + unit + ' ';
      regexp += '|';
      regexp += '\\d+\\.\\d+ ' + unit + ' ';
      first = false;
    });
    return new RegExp(regexp);
  }
  categories() { }
  select(llama, id) {
    this.activeLlama = llama; this.activeLlamaId = id;
  }
  editName() {
    this.editNameFuse = false;
    setTimeout(() => { this.editNameFuse = true; }, 100);
    this.editLlamaNameMode = true;
  }
  stopEdit() {
    if (this.editNameFuse) {
      this.editLlamaNameMode = false;
      //TODO Update name on remote
    }
  }
}
