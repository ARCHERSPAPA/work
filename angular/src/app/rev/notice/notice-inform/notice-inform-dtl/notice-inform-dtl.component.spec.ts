import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeInformDtlComponent } from './notice-inform-dtl.component';

describe('NoticeInformDtlComponent', () => {
  let component: NoticeInformDtlComponent;
  let fixture: ComponentFixture<NoticeInformDtlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeInformDtlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeInformDtlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
