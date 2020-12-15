import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleExceptionComponent } from './article-exception.component';

describe('ArticleExceptionComponent', () => {
  let component: ArticleExceptionComponent;
  let fixture: ComponentFixture<ArticleExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
