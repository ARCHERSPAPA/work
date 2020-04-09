import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleNoticeListComponent } from './article-notice-list.component';

describe('ArticleNoticeListComponent', () => {
  let component: ArticleNoticeListComponent;
  let fixture: ComponentFixture<ArticleNoticeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleNoticeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleNoticeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
