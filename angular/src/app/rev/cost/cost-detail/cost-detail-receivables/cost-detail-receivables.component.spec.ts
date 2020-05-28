import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostDetailReceivablesComponent } from './cost-detail-receivables.component';

describe('CostDetailReceivablesComponent', () => {
  let component: CostDetailReceivablesComponent;
  let fixture: ComponentFixture<CostDetailReceivablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostDetailReceivablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostDetailReceivablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
