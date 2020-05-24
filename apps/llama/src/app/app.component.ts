import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Llama, Item, ItemCategory } from '@llama/api-interfaces';

@Component({
  selector: 'llama-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  llamas: Llama[] = [{
    name: 'first',
    created: new Date(),
    items: [
      {
        name: 'abc',
        amount: '12',
        unit: 'kg',
        category: { name: '1' }
      },
      {
        name: 'def',
        category: { name: '1' }
      },
      {
        name: 'ghi',
        amount: '12',
        category: { name: '1' }
      },
      {
        name: 'hjk',
        amount: '12',
        unit: 'kg',
        category: { name: '2' }
      },
      {
        name: 'tzu',
        category: { name: '2' }
      },
      {
        name: 'iop',
        amount: '12',
        category: { name: '2' }
      },
      {
        name: 'rtz',
        amount: '12',
        unit: 'kg',
      },
      {
        name: 'wer',
      },
      {
        name: 'bnm',
        amount: '12',
      },
    ]
  },
  {
    name: 'second',
    created: new Date()
  }];
  activeLlama: Llama = this.llamas[0];
  activeCategories: ItemCategory[] = this.getCategories();
  editNameFuse: boolean = false;
  newItemFuse: boolean = false;
  editLlamaNameMode: boolean = false;
  newItemMode: boolean = false;
  activeLlamaId: number = 0;
  newItemString: string = '';
  //hello$ = this.http.get<Message>('/api/hello');
  constructor(private http: HttpClient) { }
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
    this.update();
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
      const name: string = string.replace(amountUnit, '').trim();
      const item: Item = { name, amount, unit };
      return item;
    } catch (ignored) {
      try {
        const amount: string = string.match(this.getAmountRegexp()).toString().trim();
        const name: string = string.replace(amount, '').trim();
        const item: Item = { name, amount };
        return item;
      } catch (ignored) {
        const item: Item = { name: string };
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
  update() {
    this.activeCategories = this.getCategories();
  }
}
