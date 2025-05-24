import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookAutenticacionComponent } from './facebook-autenticacion.component';

describe('FacebookAutenticacionComponent', () => {
  let component: FacebookAutenticacionComponent;
  let fixture: ComponentFixture<FacebookAutenticacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacebookAutenticacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacebookAutenticacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
