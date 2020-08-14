import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierMaterialEditComponent } from './supplier-material-edit.component';

describe('SupplierMaterialEditComponent', () => {
  let component: SupplierMaterialEditComponent;
  let fixture: ComponentFixture<SupplierMaterialEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierMaterialEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierMaterialEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
