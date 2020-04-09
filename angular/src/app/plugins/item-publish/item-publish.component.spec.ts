import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPublishComponent } from './item-publish.component';

describe('ItemPublishComponent', () => {
  let component: ItemPublishComponent;
  let fixture: ComponentFixture<ItemPublishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPublishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
