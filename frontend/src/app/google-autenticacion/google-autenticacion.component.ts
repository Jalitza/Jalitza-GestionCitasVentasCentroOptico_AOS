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
      include_granted_scopes: 'true'
    });

    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      
      const email = user.email || 
                  (result as any)?.user?.email || 
                  (result as any)?._tokenResponse?.email;

      if (!email) {
        throw new Error('No se pudo obtener el correo electrónico. Verifica que has concedido los permisos necesarios.');
      }

      
      const displayName = user.displayName || '';
      const [nombre, ...apellidos] = displayName.split(' ');
      const apellido = apellidos.join(' ');

      await this.usuariosService.guardarUsuarioSiNoExiste(user, {
        nombre: nombre || '',
        apellido: apellido || ''
      });
      
      await this.usuariosService.registrarAcceso(
        user, 
        displayName // 
      );

      console.log('✅ Sesión iniciada con Google:', user);
      alert(`Bienvenido/a ${displayName || 'Usuario Google'}`);
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión con Google:', error);
      
      let errorMessage = 'Error al iniciar sesión con Google';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'El popup de autenticación fue cerrado antes de completar el proceso';
      } else if (error.message.includes('correo electrónico')) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  }
}