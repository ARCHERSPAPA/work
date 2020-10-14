import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostDetailDiscloseComponent } from './cost-detail-disclose.component';

describe('CostDetailDiscloseComponent', () => {
  let component: CostDetailDiscloseComponent;
  let fixture: ComponentFixture<CostDetailDiscloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostDetailDiscloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostDetailDiscloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
