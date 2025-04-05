import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  lastname: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';

  constructor(private router: Router) {}

  register() {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        alert('✅ Registro exitoso'); // 
        console.log('Usuario registrado:', userCredential.user);
        this.router.navigate(['/login']); // 
      })
      .catch((error) => {
        alert('❌ Error en el registro: ' + error.message); 
      });
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
