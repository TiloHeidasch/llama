import { Component, OnInit, Input } from '@angular/core';
import { Category } from '@llama/api-interfaces';
import { UpdateCallback } from '../app.component';
import { CategoryService } from '../category.service';

@Component({
  selector: 'llama-category-drag-drop',
  templateUrl: './category-drag-drop.component.html',
  styleUrls: ['./category-drag-drop.component.scss']
})
export class CategoryDragDropComponent implements OnInit {
  @Input('category') category: Category;
  @Input('categories') categories: Category[];
  @Input('deletemode') deletemode: boolean;
  @Input('updateCallback') updateCallback: UpdateCallback;
  otherCategories = [];
  constructor(private service: CategoryService) { }
  ngOnInit() {
    this.otherCategories = [...this.categories.map(category => category.id)];
  }

  getTotalItems(): number { return this.category.itemNames === undefined ? 0 : this.category.itemNames.length }
  async dragEnd(event) {
    if (event.previousContainer === event.container) {
      //nothing to do
    } else {
      let prevCategory: Category = this.categories.find(category => category.id === event.previousContainer.id);
      let newCategory: Category = this.categories.find(category => category.id === event.container.id);
      const itemName: string = prevCategory.itemNames[event.previousIndex];
      newCategory.itemNames.push(itemName);
      prevCategory.itemNames = prevCategory.itemNames.filter(otherItemName => otherItemName !== itemName);
      if (newCategory.id !== 'uncategorized') {
        newCategory = await this.service.updateCategory(newCategory);
      }
      if (prevCategory.id !== 'uncategorized') {
        prevCategory = await this.service.updateCategory(prevCategory);
      }
      this.updateCallback.update();
    }
  }
}
