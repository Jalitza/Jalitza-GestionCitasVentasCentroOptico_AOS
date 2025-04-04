import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  lastname: string = ''; // ✅ Agregado
  email: string = '';
  phone: string = ''; // ✅ Agregado
  password: string = '';

  constructor(private router: Router) {}

  register() {
    console.log('Nombre:', this.name);
    console.log('Apellido:', this.lastname);
    console.log('Correo:', this.email);
    console.log('Teléfono:', this.phone);
    console.log('Contraseña:', this.password);
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
