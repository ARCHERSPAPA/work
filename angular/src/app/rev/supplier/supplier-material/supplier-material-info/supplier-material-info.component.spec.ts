import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierMaterialInfoComponent } from './supplier-material-info.component';

describe('SupplierMaterialInfoComponent', () => {
  let component: SupplierMaterialInfoComponent;
  let fixture: ComponentFixture<SupplierMaterialInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierMaterialInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierMaterialInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
