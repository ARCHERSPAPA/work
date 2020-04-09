import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeInformListComponent } from './notice-inform-list.component';

describe('NoticeInformListComponent', () => {
  let component: NoticeInformListComponent;
  let fixture: ComponentFixture<NoticeInformListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeInformListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeInformListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
