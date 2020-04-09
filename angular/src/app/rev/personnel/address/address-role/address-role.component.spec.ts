import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressRoleComponent } from './address-role.component';

describe('AddressRoleComponent', () => {
  let component: AddressRoleComponent;
  let fixture: ComponentFixture<AddressRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
