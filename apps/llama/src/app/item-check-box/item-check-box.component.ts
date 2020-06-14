import { Component, OnInit, Input } from '@angular/core';
import { ItemDto as Item, LlamaDto as Llama } from '@llama/api-interfaces';
import { LlamaService } from '../llama.service';
import { UpdateCallback } from '../app.component';

@Component({
  selector: 'llama-item-check-box',
  templateUrl: './item-check-box.component.html',
  styleUrls: ['./item-check-box.component.scss']
})
export class ItemCheckBoxComponent implements OnInit {
  @Input('llama') llama: Llama;
  @Input('item') item: Item;
  @Input('deletemode') deletemode: boolean;
  @Input('updateCallback') updateCallback: UpdateCallback;
  constructor(private service: LlamaService) { }

  ngOnInit(): void {
  }
  toggleDone() {
    if (this.item.done === undefined) {
      this.item.done = true;
    } else {
      this.item.done = !this.item.done;
    }
    this.service.updateItem(this.llama, this.item);
  }
  deleteItem() {
    this.service.deleteItem(this.llama, this.item);
    this.llama.items = this.llama.items.filter(otherItem => otherItem.id != this.item.id);
    this.updateCallback.update();
  }
}
