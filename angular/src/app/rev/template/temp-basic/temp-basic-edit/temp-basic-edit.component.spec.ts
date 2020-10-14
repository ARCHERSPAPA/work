import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempBasicEditComponent } from './temp-basic-edit.component';

describe('TempBasicEditComponent', () => {
  let component: TempBasicEditComponent;
  let fixture: ComponentFixture<TempBasicEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempBasicEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempBasicEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
