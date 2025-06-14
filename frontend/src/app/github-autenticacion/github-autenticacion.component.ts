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

      const email = user.email || tokenResponse?.email || githubInfo?.email;
      if (!email) {
        throw new Error('No se pudo obtener el correo electrónico de GitHub');
      }

      const displayName = githubInfo?.name || user.displayName || 'Usuario GitHub';
      
      await this.usuariosService.guardarUsuarioSiNoExiste(user, {
        nombre: displayName.split(' ')[0] || '',
        apellido: displayName.split(' ').slice(1).join(' ') || '',
        telefono: ''
      });
      
      await this.usuariosService.registrarAcceso(user, displayName); // Added displayName as second argument

      console.log('✅ Sesión iniciada con GitHub:', user);
      alert(`Bienvenido/a ${displayName}`);
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
        
        const displayName = googleResult.user.displayName || 'Usuario Google';
        await this.usuariosService.guardarUsuarioSiNoExiste(googleResult.user);
        await this.usuariosService.registrarAcceso(googleResult.user, displayName); // Added displayName as second argument
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