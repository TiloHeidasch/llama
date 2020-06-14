import { v4 as uuidv4 } from 'uuid';
export class CreateLlama {
  //@ApiProperty({ description: 'The name of the new Llama', example: 'Groceries' })
  name: string;
}
export class CreateItem {
  name: string;
  amount?: string;
  unit?: string;
  done?: boolean;
}
export class CreateCategory {
  name: string;
  itemNames?: string[];
}
export class Llama {
  readonly id: string;
  name: string;
  readonly created: Date;
  items: Item[];
  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.created = new Date();
    this.items = [];
  }
}
export interface LlamaDto {
  readonly id: string;
  name: string;
  readonly created: Date;
  items: ItemDto[];
}
export class Item {
  readonly id: string;
  readonly created: Date;
  name: string;
  done: boolean;
  amount?: string;
  unit?: string;
  constructor(name: string, amount?: string, unit?: string, done?: boolean) {
    this.id = uuidv4();
    this.created = new Date();
    this.name = name;
    this.amount = amount;
    this.unit = unit;
    if (done !== undefined) {
      this.done = done;
    } else {
      this.done = false;
    }
  }
}
export interface ItemDto {
  readonly id: string;
  readonly created: Date;
  name: string;
  done: boolean;
  amount?: string;
  unit?: string;
  category?: Category;
}
export class Category {
  readonly id: string;
  name: string;
  itemNames: string[];
  readonly created: Date;
  constructor(name: string, itemNames?: string[]) {
    this.id = uuidv4();
    this.name = name;
    if (itemNames === undefined) {
      itemNames = [];
    } else {
      this.itemNames = itemNames;
    }
    this.created = new Date();
  }
}
