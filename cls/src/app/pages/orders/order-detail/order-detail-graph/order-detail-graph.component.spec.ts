import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailGraphComponent } from './order-detail-graph.component';

describe('OrderDetailGraphComponent', () => {
  let component: OrderDetailGraphComponent;
  let fixture: ComponentFixture<OrderDetailGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDetailGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
