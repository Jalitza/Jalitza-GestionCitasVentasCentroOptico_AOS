import { Component } from '@angular/core';
import { 
  getAuth, signInWithPopup, GithubAuthProvider, 
  fetchSignInMethodsForEmail, GoogleAuthProvider, linkWithCredential 
} from 'firebase/auth';

import { getFirestore, doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-login-github',
  templateUrl: './github-autenticacion.component.html' ,
  styleUrls: ['./github-autenticacion.component.css'] 
})
export class GithubAutenticacionComponent {
  private db = getFirestore();

  async loginWithGitHub() {
    const auth = getAuth();
    const provider = new GithubAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Guardar usuario en Firestore
      await setDoc(doc(this.db, 'usuarios', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        providerId: user.providerId,
        lastLogin: new Date()
      });

      console.log('Inicio de sesión exitoso con GitHub y usuario guardado:', user);
      alert(`Bienvenido/a ${user.displayName || 'usuario'}`);

    } catch (error: any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData.email;
        const pendingCred = GithubAuthProvider.credentialFromError(error);

        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.includes('google.com')) {
          const googleProvider = new GoogleAuthProvider();
          try {
            const result = await signInWithPopup(auth, googleProvider);
            await linkWithCredential(result.user, pendingCred!);
            alert('¡Cuenta de GitHub vinculada con éxito!');
          } catch (linkError) {
            console.error('Error al vincular la cuenta:', linkError);
          }
        } else {
          alert('El correo ya está registrado con otro método.');
        }
      } else {
        console.error('Error inesperado:', error);
      }
    }
  }
}
