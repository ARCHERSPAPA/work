import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailMaterialsComponent } from './order-detail-materials.component';

describe('OrderDetailMaterialsComponent', () => {
  let component: OrderDetailMaterialsComponent;
  let fixture: ComponentFixture<OrderDetailMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDetailMaterialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
