import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signInWithPopup, FacebookAuthProvider } from 'firebase/auth';

@Component({
  selector: 'app-facebook-autenticacion',
  standalone: true,
  templateUrl: './facebook-autenticacion.component.html',
  styleUrls: ['./facebook-autenticacion.component.css']
})
export class FacebookAutenticacionComponent {
  constructor(private router: Router) {}

  loginWithFacebook() {
    const provider = new FacebookAuthProvider();
    const auth = getAuth();

    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('Usuario autenticado con Facebook:', result.user);
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Error en la autenticación con Facebook:', error);
      });
  }
}
