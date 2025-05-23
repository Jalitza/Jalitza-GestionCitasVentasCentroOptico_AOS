import { Component } from '@angular/core';
import { getAuth, signInWithPopup, GithubAuthProvider, fetchSignInMethodsForEmail, GoogleAuthProvider, linkWithCredential } from 'firebase/auth';

@Component({
  selector: 'app-login-github',
  templateUrl: './login-github.component.html'
})
export class LoginGithubComponent {

  loginWithGitHub() {
    const auth = getAuth();
    const provider = new GithubAuthProvider();

    signInWithPopup(auth, provider)
      .then(result => {
        console.log('Inicio de sesión exitoso con GitHub');
      })
      .catch(async error => {
        if (error.code === 'auth/account-exists-with-different-credential') {
          const email = error.customData.email;
          const pendingCred = GithubAuthProvider.credentialFromError(error);

          // Buscar qué métodos están registrados con ese email
          const methods = await fetchSignInMethodsForEmail(auth, email);

          if (methods.includes('google.com')) {
            const googleProvider = new GoogleAuthProvider();
            // Iniciar sesión con Google
            signInWithPopup(auth, googleProvider)
              .then(result => {
                // Vincular cuenta de GitHub
                linkWithCredential(result.user, pendingCred!)
                  .then(() => {
                    alert('¡Cuenta de GitHub vinculada con éxito!');
                  });
              });
          } else {
            alert('El correo ya está registrado con otro método.');
          }
        } else {
          console.error('Error inesperado:', error);
        }
      });
  }
}
