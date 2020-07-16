import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterTempComponent } from './master-temp.component';

describe('MasterTempComponent', () => {
  let component: MasterTempComponent;
  let fixture: ComponentFixture<MasterTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
