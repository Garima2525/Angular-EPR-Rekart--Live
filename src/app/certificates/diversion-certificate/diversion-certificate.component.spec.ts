import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiversionCertificateComponent } from './diversion-certificate.component';

describe('DiversionCertificateComponent', () => {
  let component: DiversionCertificateComponent;
  let fixture: ComponentFixture<DiversionCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiversionCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiversionCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
