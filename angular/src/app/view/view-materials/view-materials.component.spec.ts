import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMaterialsComponent } from './view-materials.component';

describe('ViewMaterialsComponent', () => {
  let component: ViewMaterialsComponent;
  let fixture: ComponentFixture<ViewMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
