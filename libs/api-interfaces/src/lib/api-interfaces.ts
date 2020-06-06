import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';
export class CreateLlama {
  //@ApiProperty({ description: 'The name of the new Llama', example: 'Groceries' })
  name: string;
}
export class CreateItem {
  //@ApiProperty({ description: 'The name of the new Item', example: 'Bananas' })
  name: string;
  //@ApiProperty({ description: 'The amount of the Item', example: '5', required: false })
  amount?: string;
  //@ApiProperty({ description: 'The unit of the amount of the Item', example: 'kg', required: false })
  unit?: string;
  done?: boolean;
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
export class Item {
  readonly id: string;
  readonly created: Date;
  name: string;
  done: boolean;
  amount?: string;
  unit?: string;
  category?: ItemCategory;
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
export interface ItemCategory {
  name: string;
  items?: Item[];
}
