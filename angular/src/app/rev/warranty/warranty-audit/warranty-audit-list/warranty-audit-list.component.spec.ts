import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyAuditListComponent } from './warranty-audit-list.component';

describe('WarrantyAuditListComponent', () => {
  let component: WarrantyAuditListComponent;
  let fixture: ComponentFixture<WarrantyAuditListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarrantyAuditListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyAuditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
