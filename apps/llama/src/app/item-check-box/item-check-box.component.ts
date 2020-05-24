import { Component, OnInit, Input } from '@angular/core';
import { Item } from '@llama/api-interfaces';

@Component({
  selector: 'llama-item-check-box',
  templateUrl: './item-check-box.component.html',
  styleUrls: ['./item-check-box.component.scss']
})
export class ItemCheckBoxComponent implements OnInit {
  @Input('item') item: Item;
  constructor() { }

  ngOnInit(): void {
  }
  toggleDone() {
    if (this.item.done === undefined) {
      this.item.done = true;
    } else {
      this.item.done = !this.item.done;
    }
    //TODO update remote
  }
}
