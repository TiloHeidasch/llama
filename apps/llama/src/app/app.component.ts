import { Component, OnInit } from '@angular/core';
import { LlamaDto as Llama, ItemDto as Item, Category } from '@llama/api-interfaces';
import { LocalCategory as ItemCategory } from './local-category'
import { LlamaService } from './llama.service';
import { CategoryService } from './category.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  newItemPlaceholderCache: string = '';
  activeLlamaId: number = 0;
  categoryMode: boolean = false;
  categories: Category[] = [];
  uncategorized: string[] = [];
  addStringFormControl = new FormControl();
  allItemNames: string[] = [];
  filteredNewItemOptions: Observable<string[]>;
  constructor(private llamaService: LlamaService, private categoryService: CategoryService) { }
  async ngOnInit() {
    this.llamas = await this.llamaService.getAllLlamas();
    this.activeLlama = this.llamas[0];
    this.activeLlamaId = 0;
    this.activeCategories = this.getCategories();
    this.categories = await this.categoryService.getAllCategories();
    this.uncategorized = await this.categoryService.getUncategorizedItemNames();
    this.categories.push({ name: 'uncategorized', id: 'uncategorized', created: new Date(), itemNames: this.uncategorized });
    this.allItemNames = await this.categoryService.getAllItemNames();
    this.filteredNewItemOptions = this.addStringFormControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
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
    const newLlama: Llama = await this.llamaService.createNewLlama('New Llama');
    this.llamas.push(newLlama);
    this.activeLlama = newLlama;
    this.activeLlamaId = this.llamas.length - 1;
  }
  async deleteLlama(llama: Llama) {
    this.llamaService.deleteLlama(llama);
    this.llamas = this.llamas.filter(otherLlama => otherLlama.id != llama.id);
    if (this.llamas.length === 0) {
      this.llamas = await this.llamaService.getAllLlamas();
    }
    if (llama.id === this.activeLlama.id) {
      this.select(this.llamas[0], 0);
    }
  }
  cleanupItems() {
    this.activeLlama.items = this.activeLlama.items.filter(item => !item.done);
    this.llamaService.updateLlama(this.activeLlama)
    this.update();
  }
  add() {
    if (this.categoryMode) {
      this.addCategory();
    } else {
      this.addItem();
    }
  }
  addItem() {
    this.pushStringToNewItem();
    this.resetItemPlaceholderCache();
  }
  async addCategory() {
    if (this.addStringFormControl.value !== null && this.addStringFormControl.value !== '') {
      this.categories.push(await this.categoryService.addCategory(this.addStringFormControl.value));
      this.addStringFormControl.setValue('');
      this.update();
    }
  }
  private async pushStringToNewItem() {
    if (this.addStringFormControl.value !== null && this.addStringFormControl.value.trim() !== '') {
      const newItem: Item = await this.parseNewItem(this.addStringFormControl.value);
      this.activeLlama.items.push(newItem);
      this.addStringFormControl.setValue('');
      this.update();
    }
  }
  async parseNewItem(addString: string): Promise<Item> {
    try {
      const amountUnit: string = addString.match(this.getAmountUnitRegexp()).toString().trim();
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
      const name: string = addString.replace(amountUnit, '').trim();
      const item: Item = await this.llamaService.createNewItem(this.activeLlama, name, amount, unit);
      return item;
    } catch (ignored) {
      try {
        const amount: string = addString.match(this.getAmountRegexp()).toString().trim();
        const name: string = addString.replace(amount, '').trim();
        const item: Item = await this.llamaService.createNewItem(this.activeLlama, name, amount);
        return item;
      } catch (ignored) {
        const item: Item = await this.llamaService.createNewItem(this.activeLlama, addString);
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
  selectCategories() {
    this.categoryMode = true;
  }
  select(llama, id) {
    this.categoryMode = false;
    this.activeLlama = this.llamas[id];
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
      this.activeLlama = await this.llamaService.updateLlama(this.activeLlama);
    }
  }
  async update() {
    this.llamas = await this.llamaService.getAllLlamas();
    this.activeCategories = this.getCategories();
    this.categories = await this.categoryService.getAllCategories();
    this.uncategorized = await this.categoryService.getUncategorizedItemNames();
    this.categories.push({ name: 'uncategorized', id: 'uncategorized', created: new Date(), itemNames: this.uncategorized });
    this.allItemNames = await this.categoryService.getAllItemNames();
  }
  getNewItemPlaceHolder(): string {
    if (this.newItemPlaceholderCache === '') {
      const amount: string = this.getRandomAmount();
      const unit: string = this.getRandomUnit();
      const item: string = this.getRandomItemName();
      switch (this.randbetween(0, 10)) {
        case 0:
          //no unit
          this.newItemPlaceholderCache = amount + ' ' + item;
        case 1:
          //no amount no unit
          this.newItemPlaceholderCache = item;
        default:
          //amount unit and name
          this.newItemPlaceholderCache = amount + unit + ' ' + item;
      }
    }
    return this.newItemPlaceholderCache.toString();
  }
  private resetItemPlaceholderCache() {
    this.newItemPlaceholderCache = '';
  }
  getRandomItemName(): string {
    const itemNames: string[] = ['Banana', 'Apple', 'Cherry',];
    return itemNames[this.randbetween(0, itemNames.length - 1)];
  }
  getRandomUnit(): string {
    const unitNames: string[] = ['kg', 'pcs', 'pieces', 'packs',];
    return unitNames[this.randbetween(0, unitNames.length - 1)];
  }
  getRandomAmount(): string {
    return this.randbetween(1, 10).toString();
  }
  private randbetween(min, max) {
    return Math.floor(Math.random() * max) + min;
  }
  private _filter(value: string): string[] {
    let amountUnit: string = '';
    let amount: string = '';
    try {
      amount = value.toLowerCase().match(this.getAmountRegexp()).toString().trim();
    } catch (ignored) {

    }
    try {
      amountUnit = value.toLowerCase().match(this.getAmountUnitRegexp()).toString().trim();
    } catch (ignored) {

    }
    const filterValue = value.toLowerCase().replace(amountUnit, '').trim().replace(amount, '').trim();
    return this.allItemNames.filter(option => option.toLowerCase().includes(filterValue));
  }
}
export interface UpdateCallback {
  update();
}
