import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeInformAddComponent } from './notice-inform-add.component';

describe('NoticeInformAddComponent', () => {
  let component: NoticeInformAddComponent;
  let fixture: ComponentFixture<NoticeInformAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeInformAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeInformAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
