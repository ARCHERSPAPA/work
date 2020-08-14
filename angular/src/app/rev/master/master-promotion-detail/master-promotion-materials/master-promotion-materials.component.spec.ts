import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPromotionMaterialsComponent } from './master-promotion-materials.component';

describe('MasterPromotionMaterialsComponent', () => {
  let component: MasterPromotionMaterialsComponent;
  let fixture: ComponentFixture<MasterPromotionMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPromotionMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPromotionMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
