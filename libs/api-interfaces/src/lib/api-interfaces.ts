export interface Message {
  message: string;
}
export interface Llama {
  name: string;
  created: Date;
  items?: Item[];
}
export interface Item {
  name: string;
  amount?: string;
  unit?: string;
  category?: ItemCategory;
}
export interface ItemCategory {
  name: string;
  items?: Item[];
}
