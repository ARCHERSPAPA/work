import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialListComponent } from './add-material-list.component';

describe('AddMaterialListComponent', () => {
  let component: AddMaterialListComponent;
  let fixture: ComponentFixture<AddMaterialListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaterialListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaterialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
