import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettleListComponent } from './settle-list.component';

describe('SettleListComponent', () => {
  let component: SettleListComponent;
  let fixture: ComponentFixture<SettleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
