import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';
export class CreateLlama {
  @ApiProperty({ description: 'The name of the new Llama', example: 'Groceries' })
  name: string;
}
export class Llama {
  id: string;
  name: string;
  created: Date;
  items?: Item[];
  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.created = new Date();
    this.items = [];
  }
}
export interface Item {
  name: string;
  amount?: string;
  unit?: string;
  category?: ItemCategory;
  done?: boolean;
}
export interface ItemCategory {
  name: string;
  items?: Item[];
}
