import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-facebook-autenticacion',
  standalone: true,
  templateUrl: './facebook-autenticacion.component.html',
  styleUrls: ['./facebook-autenticacion.component.css']
})
export class FacebookAutenticacionComponent {
  private db = getFirestore(); // Inicializa Firestore aquí

  constructor(private router: Router) {}

  async loginWithFacebook() {
    const provider = new FacebookAuthProvider();
    const auth = getAuth();

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

      console.log('Usuario autenticado y guardado en Firestore:', user);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error en la autenticación con Facebook:', error);
    }
  }
}
