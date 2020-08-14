import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierMaterialDetailComponent } from './supplier-material-detail.component';

describe('SupplierMaterialDetailComponent', () => {
  let component: SupplierMaterialDetailComponent;
  let fixture: ComponentFixture<SupplierMaterialDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierMaterialDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierMaterialDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
