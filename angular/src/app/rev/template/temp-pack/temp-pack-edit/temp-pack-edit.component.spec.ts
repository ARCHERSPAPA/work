import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempPackEditComponent } from './temp-pack-edit.component';

describe('TempPackEditComponent', () => {
  let component: TempPackEditComponent;
  let fixture: ComponentFixture<TempPackEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempPackEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempPackEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
