import { Component } from '@angular/core';
import { getAuth, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-github-autenticacion',
  templateUrl: './github-autenticacion.component.html',
  styleUrls: ['./github-autenticacion.component.css']
})
export class GithubAutenticacionComponent {

  constructor(private router: Router) {}

  loginWithGitHub() {
    const auth = getAuth();
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then(result => {
        alert('✅ Autenticación con GitHub exitosa');
        this.router.navigate(['/home']);
      })
      .catch(error => {
        alert('❌ Error en la autenticación: ' + error.message);
      });
  }
}
