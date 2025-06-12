import { Component } from '@angular/core';
import { 
  getAuth, signInWithPopup, GithubAuthProvider, 
  fetchSignInMethodsForEmail, GoogleAuthProvider, linkWithCredential 
} from 'firebase/auth';
import { UsuariosService } from '../servicios/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-github',
  templateUrl: './github-autenticacion.component.html',
  styleUrls: ['./github-autenticacion.component.css']
})
export class GithubAutenticacionComponent {
  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  async loginWithGitHub() {
    const auth = getAuth();
    const provider = new GithubAuthProvider();
    provider.addScope('user:email');
    provider.addScope('read:user');

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const tokenResponse = (result as any)._tokenResponse;
      const githubInfo = tokenResponse?.rawUserInfo ? JSON.parse(tokenResponse.rawUserInfo) : {};

      // Verificar que tenemos email (requerido)
      const email = user.email || tokenResponse?.email || githubInfo?.email;
      if (!email) {
        throw new Error('No se pudo obtener el correo electrónico de GitHub');
      }

      // Usar el servicio actualizado
      await this.usuariosService.guardarUsuarioSiNoExiste(user, {
        nombre: githubInfo?.name || user.displayName?.split(' ')[0] || '',
        apellido: user.displayName?.split(' ').slice(1).join(' ') || '',
        telefono: '' // Opcional: puedes obtenerlo de otra fuente si es necesario
      });

      console.log('✅ Sesión iniciada con GitHub:', user);
      alert(`Bienvenido/a ${user.displayName || 'Usuario GitHub'}`);
      this.router.navigate(['/home']);

    } catch (error: any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        await this.manejarCuentaExistente(error);
      } else {
        console.error('Error inesperado:', error);
        alert(`Error al iniciar sesión: ${error.message}`);
      }
    }
  }

  private async manejarCuentaExistente(error: any) {
    const auth = getAuth();
    const email = error.customData.email;
    const pendingCred = GithubAuthProvider.credentialFromError(error);
    const methods = await fetchSignInMethodsForEmail(auth, email);

    if (methods.includes('google.com')) {
      try {
        const googleProvider = new GoogleAuthProvider();
        const googleResult = await signInWithPopup(auth, googleProvider);
        await linkWithCredential(googleResult.user, pendingCred!);
        
        await this.usuariosService.guardarUsuarioSiNoExiste(googleResult.user);
        alert('¡Cuenta de GitHub vinculada con éxito!');
        this.router.navigate(['/home']);
      } catch (linkError) {
        console.error('Error al vincular la cuenta:', linkError);
        alert('Error al vincular cuentas: ' + (linkError as Error).message);
      }
    } else {
      alert(`El correo ${email} ya está registrado con otro método.`);
    }
  }
}