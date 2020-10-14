import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPackMasterialsComponent } from './master-pack-masterials.component';

describe('MasterPackMasterialsComponent', () => {
  let component: MasterPackMasterialsComponent;
  let fixture: ComponentFixture<MasterPackMasterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPackMasterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPackMasterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
