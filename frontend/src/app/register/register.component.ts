import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private router: Router) {} // Inyecta Router

  register() {
    console.log('Nombre:', this.name);
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);
  }

  redirectToLogin() {
    this.router.navigate(['/login']); // Redirecciona al login
  }
}
