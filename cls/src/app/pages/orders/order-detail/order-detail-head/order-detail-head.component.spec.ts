import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailHeadComponent } from './order-detail-head.component';

describe('OrderDetailHeadComponent', () => {
  let component: OrderDetailHeadComponent;
  let fixture: ComponentFixture<OrderDetailHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDetailHeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
