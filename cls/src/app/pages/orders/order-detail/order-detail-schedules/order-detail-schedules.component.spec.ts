import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailSchedulesComponent } from './order-detail-schedules.component';

describe('OrderDetailSchedulesComponent', () => {
  let component: OrderDetailSchedulesComponent;
  let fixture: ComponentFixture<OrderDetailSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDetailSchedulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
