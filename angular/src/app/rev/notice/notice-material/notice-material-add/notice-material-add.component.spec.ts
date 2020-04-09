import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeMaterialAddComponent } from './notice-material-add.component';

describe('NoticeMaterialAddComponent', () => {
  let component: NoticeMaterialAddComponent;
  let fixture: ComponentFixture<NoticeMaterialAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeMaterialAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeMaterialAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
