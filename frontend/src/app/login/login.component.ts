import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { GoogleAutenticacionComponent } from '../google-autenticacion/google-autenticacion.component';
import { GithubAutenticacionComponent } from '../github-autenticacion/github-autenticacion.component';
import { FacebookAutenticacionComponent } from "../facebook-autenticacion/facebook-autenticacion.component";
import { RecuperarPasswordComponent } from '../recuperar-password/recuperar-password.component';

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

  constructor(private router: Router) {} 

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
      
      console.log('✅ Inicio de sesión exitoso:', userCredential.user);
      this.router.navigate(['/home']);
      
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión:', error);
      alert(this.getErrorMessage(error));
      
    } finally {
      this.isLoading = false;
    }
  }

  private getErrorMessage(error: any): string {
    const errorMap: Record<string, string> = {
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/user-disabled': 'Cuenta deshabilitada',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde'
    };
    return errorMap[error.code] || 'Error al iniciar sesión. Por favor intenta nuevamente.';
  }

  irARecuperarPassword() {
    this.router.navigate(['/recuperar-password']);
  }
}