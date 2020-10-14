import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAuxiliaryComponent } from './master-auxiliary.component';

describe('MasterAuxiliaryComponent', () => {
  let component: MasterAuxiliaryComponent;
  let fixture: ComponentFixture<MasterAuxiliaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterAuxiliaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterAuxiliaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
