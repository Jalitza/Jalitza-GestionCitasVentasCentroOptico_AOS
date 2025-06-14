import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { GoogleAutenticacionComponent } from '../google-autenticacion/google-autenticacion.component';
import { GithubAutenticacionComponent } from '../github-autenticacion/github-autenticacion.component';
import { FacebookAutenticacionComponent } from "../facebook-autenticacion/facebook-autenticacion.component";
import { RecuperarPasswordComponent } from '../recuperar-password/recuperar-password.component';
import { UsuariosService } from '../servicios/usuarios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule, 
    RouterModule, 
    GoogleAutenticacionComponent, 
    GithubAutenticacionComponent, 
    FacebookAutenticacionComponent, 
    RecuperarPasswordComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  async login() {
    if (!this.email || !this.password) {
      alert('Por favor ingresa email y contraseña');
      return;
    }

    this.isLoading = true;
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        this.email, 
        this.password
      );
      
      // Get display name from user or use email prefix as fallback
      const displayName = userCredential.user.displayName || 
                        this.email.split('@')[0] || 
                        'Usuario';
      
      // Registrar usuario y acceso
      await this.usuariosService.guardarUsuarioSiNoExiste(userCredential.user);
      await this.usuariosService.registrarAcceso(userCredential.user, displayName);
      
      this.router.navigate(['/home']);
      
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      alert(this.getErrorMessage(error));
    } finally {
      this.isLoading = false;
    }
  }

  // Métodos para autenticación social
  onGoogleLoginSuccess(user: any) {
    this.handleSocialLogin(user);
  }

  onGithubLoginSuccess(user: any) {
    this.handleSocialLogin(user);
  }

  onFacebookLoginSuccess(user: any) {
    this.handleSocialLogin(user);
  }

  private async handleSocialLogin(user: any) {
    try {
      const displayName = user.displayName || 'Usuario Social';
      await this.usuariosService.guardarUsuarioSiNoExiste(user);
      await this.usuariosService.registrarAcceso(user, displayName);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error en login social:', error);
      alert('Error al iniciar sesión con red social');
    }
  }

  private getErrorMessage(error: { code?: string; message?: string }): string {
    const errorMap: Record<string, string> = {
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/user-disabled': 'Cuenta deshabilitada',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/email-already-in-use': 'El correo ya está registrado',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres'
    };

    if (error.code && typeof error.code === 'string' && error.code in errorMap) {
      return errorMap[error.code];
    }
    
    return error.message || 'Error al iniciar sesión. Por favor intenta nuevamente.';
  }

  irARecuperarPassword() {
    this.router.navigate(['/recuperar-password']);
  }
}