import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCheckBoxComponent } from './item-check-box.component';

describe('ItemCheckBoxComponent', () => {
  let component: ItemCheckBoxComponent;
  let fixture: ComponentFixture<ItemCheckBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCheckBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCheckBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
