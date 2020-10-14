import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempPackListComponent } from './temp-pack-list.component';

describe('TempPackListComponent', () => {
  let component: TempPackListComponent;
  let fixture: ComponentFixture<TempPackListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempPackListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempPackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
