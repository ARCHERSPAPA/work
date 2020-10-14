import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMakingsComponent } from './new-makings.component';

describe('NewMakingsComponent', () => {
  let component: NewMakingsComponent;
  let fixture: ComponentFixture<NewMakingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMakingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMakingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
