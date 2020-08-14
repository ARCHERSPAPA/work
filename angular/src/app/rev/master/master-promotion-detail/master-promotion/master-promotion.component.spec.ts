import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPromotionComponent } from './master-promotion.component';

describe('MasterPromotionComponent', () => {
  let component: MasterPromotionComponent;
  let fixture: ComponentFixture<MasterPromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPromotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
