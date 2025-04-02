import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, // Indica que es un componente independiente
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule] // Agrega FormsModule
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor() {}

  onSubmit() {
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);
  }
}
