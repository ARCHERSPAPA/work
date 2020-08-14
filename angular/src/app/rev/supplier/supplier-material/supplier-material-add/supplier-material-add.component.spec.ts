import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierMaterialAddComponent } from './supplier-material-add.component';

describe('SupplierMaterialAddComponent', () => {
  let component: SupplierMaterialAddComponent;
  let fixture: ComponentFixture<SupplierMaterialAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierMaterialAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierMaterialAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
