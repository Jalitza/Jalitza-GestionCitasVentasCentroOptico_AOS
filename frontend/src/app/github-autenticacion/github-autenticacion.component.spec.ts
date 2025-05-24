import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubAutenticacionComponent } from './github-autenticacion.component';

describe('GithubAutenticacionComponent', () => {
  let component: GithubAutenticacionComponent;
  let fixture: ComponentFixture<GithubAutenticacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GithubAutenticacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GithubAutenticacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
