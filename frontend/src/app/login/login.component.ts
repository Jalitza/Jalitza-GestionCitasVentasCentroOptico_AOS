import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importa Router
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {} // Inyectar Router

  login() {
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);

    // Simulación de autenticación
    if (this.email === 'admin@example.com' && this.password === '123456') {
      console.log('Inicio de sesión exitoso');
      this.router.navigate(['/home']); // Redirige al home después de iniciar sesión
    } else {
      console.log('Credenciales incorrectas');
    }
  }
}
