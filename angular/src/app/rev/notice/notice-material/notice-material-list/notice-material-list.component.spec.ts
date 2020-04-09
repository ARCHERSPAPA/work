import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeMaterialListComponent } from './notice-material-list.component';

describe('NoticeMaterialListComponent', () => {
  let component: NoticeMaterialListComponent;
  let fixture: ComponentFixture<NoticeMaterialListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeMaterialListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeMaterialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
