import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { RouterModule } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { GoogleAutenticacionComponent } from '../google-autenticacion/google-autenticacion.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, GoogleAutenticacionComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {} 

  login() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        console.log('Inicio de sesión exitoso:', userCredential);
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Error al iniciar sesión:', error.message);
      });
  }
}