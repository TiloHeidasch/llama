import { Component, OnInit, Injectable, Input } from '@angular/core';
import { LlamaDto as Llama } from '@llama/api-interfaces';
import { LocalCategory as ItemCategory } from "../local-category";
import { UpdateCallback } from '../app.component';

@Component({
  selector: 'llama-category-drop-down',
  templateUrl: './category-drop-down.component.html',
  styleUrls: ['./category-drop-down.component.scss']
})
export class CategoryDropDownComponent implements OnInit {
  @Input('llama') llama: Llama;
  @Input('category') category: ItemCategory;
  @Input('deletemode') deletemode: boolean;
  @Input('updateCallback') updateCallback: UpdateCallback;
  isExpanded = true;
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
