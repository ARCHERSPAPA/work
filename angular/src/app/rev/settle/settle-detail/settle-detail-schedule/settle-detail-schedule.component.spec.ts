import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettleDetailScheduleComponent } from './settle-detail-schedule.component';

describe('SettleDetailScheduleComponent', () => {
  let component: SettleDetailScheduleComponent;
  let fixture: ComponentFixture<SettleDetailScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettleDetailScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettleDetailScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
