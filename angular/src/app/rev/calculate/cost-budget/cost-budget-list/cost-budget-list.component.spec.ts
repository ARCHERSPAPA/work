import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostBudgetListComponent } from './cost-budget-list.component';

describe('CostBudgetListComponent', () => {
  let component: CostBudgetListComponent;
  let fixture: ComponentFixture<CostBudgetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostBudgetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostBudgetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
