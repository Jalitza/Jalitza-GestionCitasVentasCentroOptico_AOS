import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
