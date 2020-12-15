import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleExceptionDetailComponent } from './article-exception-detail.component';

describe('ArticleExceptionDetailComponent', () => {
  let component: ArticleExceptionDetailComponent;
  let fixture: ComponentFixture<ArticleExceptionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleExceptionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleExceptionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
