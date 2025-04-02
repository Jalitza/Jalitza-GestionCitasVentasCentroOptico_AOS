import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], // <--- Agrega FormsModule aquí
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  login() {
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);
  }
}