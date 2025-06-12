import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { UsuariosService } from '../servicios/usuarios.service';

@Component({
  selector: 'app-google-autenticacion',
  templateUrl: './google-autenticacion.component.html',
  styleUrls: ['./google-autenticacion.component.css']
})
export class GoogleAutenticacionComponent {
  constructor(
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({
      prompt: 'select_account',
      login_hint: '',
      'include_granted_scopes': 'true'
    });

    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        throw new Error('No se pudo obtener el correo electrónico de Google');
      }

      // Usar el servicio actualizado pasando el objeto User directamente
      await this.usuariosService.guardarUsuarioSiNoExiste(user, {
        nombre: user.displayName?.split(' ')[0] || '',
        apellido: user.displayName?.split(' ').slice(1).join(' ') || ''
      });

      console.log('✅ Sesión iniciada con Google:', user);
      alert(`Bienvenido/a ${user.displayName || 'Usuario Google'}`);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('❌ Error al iniciar sesión con Google:', error);
      alert('Error: ' + (error as Error).message);
    }
  }
}