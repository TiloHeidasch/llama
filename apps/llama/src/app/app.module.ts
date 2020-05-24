import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { CategoryDropDownComponent } from './category-drop-down/category-drop-down.component';
import { ItemCheckBoxComponent } from './item-check-box/item-check-box.component';

@NgModule({
  declarations: [AppComponent, CategoryDropDownComponent, ItemCheckBoxComponent],
  imports: [BrowserModule, HttpClientModule, BrowserAnimationsModule, MaterialModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
