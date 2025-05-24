import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleAutenticacionComponent } from './google-autenticacion.component';

describe('GoogleAutenticacionComponent', () => {
  let component: GoogleAutenticacionComponent;
  let fixture: ComponentFixture<GoogleAutenticacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleAutenticacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleAutenticacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
