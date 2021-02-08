import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderImgComponent } from './uploader-img.component';

describe('UploaderImgComponent', () => {
  let component: UploaderImgComponent;
  let fixture: ComponentFixture<UploaderImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploaderImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
