import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMakingsComponent } from './item-makings.component';

describe('ItemMakingsComponent', () => {
  let component: ItemMakingsComponent;
  let fixture: ComponentFixture<ItemMakingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMakingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMakingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
