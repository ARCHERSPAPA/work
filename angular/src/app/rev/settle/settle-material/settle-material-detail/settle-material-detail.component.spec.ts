import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettleMaterialDetailComponent } from './settle-material-detail.component';

describe('SettleMaterialDetailComponent', () => {
  let component: SettleMaterialDetailComponent;
  let fixture: ComponentFixture<SettleMaterialDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettleMaterialDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettleMaterialDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
