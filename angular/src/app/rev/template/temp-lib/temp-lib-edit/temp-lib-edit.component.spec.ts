import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempLibEditComponent } from './temp-lib-edit.component';

describe('TempLibEditComponent', () => {
  let component: TempLibEditComponent;
  let fixture: ComponentFixture<TempLibEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempLibEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempLibEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
