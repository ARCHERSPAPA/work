import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsSketchComponent } from './stats-sketch.component';

describe('StatsSketchComponent', () => {
  let component: StatsSketchComponent;
  let fixture: ComponentFixture<StatsSketchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsSketchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsSketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
