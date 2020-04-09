import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseTabsMaterialsComponent } from './case-tabs-materials.component';

describe('CaseTabsMaterialsComponent', () => {
  let component: CaseTabsMaterialsComponent;
  let fixture: ComponentFixture<CaseTabsMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseTabsMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseTabsMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
