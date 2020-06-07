import { Component, OnInit, Input } from '@angular/core';
import { Item, Llama } from '@llama/api-interfaces';
import { LlamaService } from '../llama.service';

@Component({
  selector: 'llama-item-check-box',
  templateUrl: './item-check-box.component.html',
  styleUrls: ['./item-check-box.component.scss']
})
export class ItemCheckBoxComponent implements OnInit {
  @Input('llama') llama: Llama;
  @Input('item') item: Item;
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
}
