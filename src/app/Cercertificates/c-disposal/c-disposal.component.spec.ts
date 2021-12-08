import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CDisposalComponent } from './c-disposal.component';

describe('CDisposalComponent', () => {
  let component: CDisposalComponent;
  let fixture: ComponentFixture<CDisposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CDisposalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CDisposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
