import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { UsuariosService } from '../servicios/usuarios.service';

@Component({
  selector: 'app-facebook-autenticacion',
  standalone: true,
  templateUrl: './facebook-autenticacion.component.html',
  styleUrls: ['./facebook-autenticacion.component.css']
})
export class FacebookAutenticacionComponent {
  constructor(
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  async loginWithFacebook() {
  const provider = new FacebookAuthProvider();
  provider.addScope('email');
  provider.addScope('public_profile');
  provider.setCustomParameters({
    'display': 'popup'
  });
  const auth = getAuth();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await this.usuariosService.guardarUsuarioSiNoExiste(user);
    await this.usuariosService.registrarAcceso(user, user.displayName || ''); // Added user.displayName as second argument

    console.log('✅ Usuario autenticado y guardado en Firestore:', user);
    alert('Bienvenido/a ' + user.displayName);
    this.router.navigate(['/home']);
  } catch (error) {
    console.error('❌ Error en la autenticación con Facebook:', error);
    alert('Error: ' + (error as Error).message);
  }
}
}