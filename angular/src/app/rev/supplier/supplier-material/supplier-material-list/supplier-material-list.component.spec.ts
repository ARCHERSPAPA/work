import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierMaterialListComponent } from './supplier-material-list.component';

describe('SupplierMaterialListComponent', () => {
  let component: SupplierMaterialListComponent;
  let fixture: ComponentFixture<SupplierMaterialListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierMaterialListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierMaterialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
