import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

@Component({
  selector: 'app-google-autenticacion',
  templateUrl: './google-autenticacion.component.html',
  styleUrls: ['./google-autenticacion.component.css']
})
export class GoogleAutenticacionComponent {

  constructor(private router: Router) {}

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('✅ Sesión iniciada con Google:', result.user);
        alert('Bienvenido/a ' + result.user.displayName);
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('❌ Error al iniciar sesión con Google:', error);
        alert('Error: ' + error.message);
      });
  }
}
