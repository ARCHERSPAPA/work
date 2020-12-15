import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterClassRestrictComponent } from './master-class-restrict.component';

describe('MasterClassRestrictComponent', () => {
  let component: MasterClassRestrictComponent;
  let fixture: ComponentFixture<MasterClassRestrictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterClassRestrictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterClassRestrictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
