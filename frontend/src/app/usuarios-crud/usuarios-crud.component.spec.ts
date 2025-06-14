import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosCrudComponent } from './usuarios-crud.component';

describe('UsuariosCrudComponent', () => {
  let component: UsuariosCrudComponent;
  let fixture: ComponentFixture<UsuariosCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
