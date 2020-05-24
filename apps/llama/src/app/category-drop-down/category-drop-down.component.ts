import { Component, OnInit, Injectable, Input } from '@angular/core';
import { ItemCategory } from '@llama/api-interfaces';

@Component({
  selector: 'llama-category-drop-down',
  templateUrl: './category-drop-down.component.html',
  styleUrls: ['./category-drop-down.component.scss']
})
export class CategoryDropDownComponent implements OnInit {
  @Input('category') category: ItemCategory;
  isExpanded = false;
  constructor() { }

  ngOnInit(): void {
  }
  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }
  getDoneItems(): number {
    let done: number = 0;
    this.category.items.forEach(item => {
      if (item.done) done++;
    });
    return done;
  }
  getTotalItems(): number { return this.category.items.length }
}