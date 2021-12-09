import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrderPoComponent } from './edit-order-po.component';

describe('EditOrderPoComponent', () => {
  let component: EditOrderPoComponent;
  let fixture: ComponentFixture<EditOrderPoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOrderPoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrderPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
