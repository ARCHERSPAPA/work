import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsAttendanceComponent } from './stats-attendance.component';

describe('StatsAttendanceComponent', () => {
  let component: StatsAttendanceComponent;
  let fixture: ComponentFixture<StatsAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
