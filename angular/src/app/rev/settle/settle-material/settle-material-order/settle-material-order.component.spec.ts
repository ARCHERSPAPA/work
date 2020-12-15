import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettleMaterialOrderComponent } from './settle-material-order.component.ts.back';

describe('SettleMaterialOrderComponentTs', () => {
  let component: SettleMaterialOrderComponent;
  let fixture: ComponentFixture<SettleMaterialOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettleMaterialOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettleMaterialOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
