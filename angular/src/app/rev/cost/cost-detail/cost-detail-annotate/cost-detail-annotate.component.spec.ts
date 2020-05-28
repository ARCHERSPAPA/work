import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostDetailAnnotateComponent } from './cost-detail-annotate.component';

describe('CostDetailAnnotateComponent', () => {
  let component: CostDetailAnnotateComponent;
  let fixture: ComponentFixture<CostDetailAnnotateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostDetailAnnotateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostDetailAnnotateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
