import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Llama, Item, ItemCategory } from '@llama/api-interfaces';
import { LlamaService } from './llama.service';

@Component({
  selector: 'llama-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, UpdateCallback {
  llamas: Llama[];
  activeLlama: Llama;
  activeCategories: ItemCategory[];
  editNameFuse: boolean = false;
  editLlamaNameMode: boolean = false;
  deletemode: boolean = false;
  updateCallback: UpdateCallback = this;
  activeLlamaId: number = 0;
  newItemString: string = '';
  constructor(private service: LlamaService) { }
  async ngOnInit() {
    this.llamas = await this.service.getAllLlamas();
    this.activeLlama = this.llamas[0];
    this.activeCategories = this.getCategories();
  }
  getCategories(): ItemCategory[] {
    const categories: ItemCategory[] = [];
    const rest: ItemCategory = { name: 'Rest', items: [] };
    this.activeLlama.items.forEach(item => {
      if (item.category === undefined) {
        rest.items.push(item);
      } else {
        let index = categories.findIndex((element) => element.name === item.category.name);
        if (index === -1) {
          categories.push(JSON.parse(JSON.stringify(item.category)));
          index = categories.length - 1;
        }
        if (categories[index].items === undefined) {
          categories[index].items = [];
        }
        categories[index].items.push(item);
      }
    });
    categories.push(rest);
    return categories;
  }

  async addNewLlama() {
    const newLlama: Llama = await this.service.createNewLlama('New Llama');
    this.llamas.push(newLlama);
    this.activeLlama = newLlama;
    this.activeLlamaId = this.llamas.length - 1;
  }
  deleteLlama(llama: Llama) {
    this.service.deleteLlama(llama);
  }
  cleanupItems() {
    this.activeLlama.items = this.activeLlama.items.filter(item => !item.done);
    this.service.updateLlama(this.activeLlama)
    this.update();
  }
  addItem() {
    this.pushStringToNewItem()
  }
  private async pushStringToNewItem() {
    if (this.newItemString.trim() !== '') {
      const newItem: Item = await this.parseNewItem(this.newItemString);
      this.activeLlama.items.push(newItem);
      this.newItemString = '';
      this.update();
    }
  }
  async parseNewItem(newItemString: string): Promise<Item> {
    try {
      const amountUnit: string = newItemString.match(this.getAmountUnitRegexp()).toString().trim();
      const amount: string = amountUnit.match(this.getAmountRegexp()).toString().trim();
      let unit: string = amountUnit.replace(amount, '').trim();
      switch (unit) {
        case 'Gramm':
        case 'gramm':
        case 'G':
          unit = 'g'
          break;
        case 'Kg':
        case 'kilogramm':
        case 'Kilogramm':
          unit = 'kg'
          break;
        case 'Stk':
        case 'Stück':
          unit = 'stk'
          break;

        case 'Pkg':
        case 'Packung':
        case 'Packungen':
          unit = 'pkg'
          break;
        default:
          break;
      }
      const name: string = newItemString.replace(amountUnit, '').trim();
      const item: Item = await this.service.createNewItem(this.activeLlama, name, amount, unit);
      return item;
    } catch (ignored) {
      try {
        const amount: string = newItemString.match(this.getAmountRegexp()).toString().trim();
        const name: string = newItemString.replace(amount, '').trim();
        const item: Item = await this.service.createNewItem(this.activeLlama, name, amount);
        return item;
      } catch (ignored) {
        const item: Item = await this.service.createNewItem(this.activeLlama, newItemString);
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
      'gramm',
      'Gramm',
      'kg',
      'Kg',
      'kilo',
      'Kilo',
      'kilogramm',
      'Kilogramm',
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
    console.log({ activeLlama: this.activeLlama, llama });
    this.activeLlama = llama;
    this.activeLlamaId = id;
    this.update();
  }
  editName() {
    this.editNameFuse = false;
    setTimeout(() => { this.editNameFuse = true; }, 100);
    this.editLlamaNameMode = true;
  }
  async stopEdit() {
    if (this.editNameFuse) {
      this.editLlamaNameMode = false;
      this.activeLlama = await this.service.updateLlama(this.activeLlama);
    }
  }
  update() {
    this.activeCategories = this.getCategories();
  }
}
export interface UpdateCallback {
  update();
}
