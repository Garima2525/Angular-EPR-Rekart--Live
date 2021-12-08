import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposalCertificateComponent } from './disposal-certificate.component';

describe('DisposalCertificateComponent', () => {
  let component: DisposalCertificateComponent;
  let fixture: ComponentFixture<DisposalCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisposalCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisposalCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
