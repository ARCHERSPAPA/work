import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlesComponent } from './settles.component';

describe('SettlesComponent', () => {
  let component: SettlesComponent;
  let fixture: ComponentFixture<SettlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
