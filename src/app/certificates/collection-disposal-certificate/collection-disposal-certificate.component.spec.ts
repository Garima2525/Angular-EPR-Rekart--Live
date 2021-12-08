import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionDisposalCertificateComponent } from './collection-disposal-certificate.component';

describe('CollectionDisposalCertificateComponent', () => {
  let component: CollectionDisposalCertificateComponent;
  let fixture: ComponentFixture<CollectionDisposalCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionDisposalCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionDisposalCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
