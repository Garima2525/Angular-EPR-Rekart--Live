import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetviewComponent } from './targetview.component';

describe('TargetviewComponent', () => {
  let component: TargetviewComponent;
  let fixture: ComponentFixture<TargetviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
