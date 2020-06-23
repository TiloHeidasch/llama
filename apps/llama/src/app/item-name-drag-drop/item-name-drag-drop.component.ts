import { Component, OnInit, Input } from '@angular/core';
import { UpdateCallback } from '../app.component';
import { CategoryService } from '../category.service';
import { Category } from '@llama/api-interfaces';
import { EmojiService } from '../emoji.service';

@Component({
  selector: 'llama-item-name-drag-drop',
  templateUrl: './item-name-drag-drop.component.html',
  styleUrls: ['./item-name-drag-drop.component.scss']
})
export class ItemNameDragDropComponent implements OnInit {
  @Input('category') category: Category;
  @Input('itemName') itemName: string;
  @Input('deletemode') deletemode: boolean;
  @Input('updateCallback') updateCallback: UpdateCallback;
  emoji: string = '';

  constructor(private service: CategoryService, private emojiService: EmojiService) { }
  async ngOnInit() {
    this.emoji = await this.emojiService.getEmojiForText(this.itemName);
  }
  async deleteItem() {
    this.category.itemNames = this.category.itemNames.filter(otherItemName => otherItemName !== this.itemName);
    if (this.category.id !== 'uncategorized') {
      this.category = await this.service.updateCategory(this.category);
    }
    this.updateCallback.update();
  }
}
