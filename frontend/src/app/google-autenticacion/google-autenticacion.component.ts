import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-google-autenticacion',
  templateUrl: './google-autenticacion.component.html',
  styleUrls: ['./google-autenticacion.component.css']
})
export class GoogleAutenticacionComponent {
  private db = getFirestore();

  constructor(private router: Router) {}

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
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
        providerId: user.providerData[0]?.providerId || null,
        lastLogin: new Date()
      });

      console.log('✅ Sesión iniciada con Google y usuario guardado:', user);
      alert('Bienvenido/a ' + user.displayName);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('❌ Error al iniciar sesión con Google:', error);
      alert('Error: ' + (error as Error).message);
    }
  }
}
