/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BindAddComponent } from './bind-add.component';

describe('BindAddComponent', () => {
  let component: BindAddComponent;
  let fixture: ComponentFixture<BindAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BindAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BindAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
