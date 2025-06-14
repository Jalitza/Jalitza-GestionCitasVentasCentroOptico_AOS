import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { UsuariosService } from '../servicios/usuarios.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;

  usuario = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    contrasena: '',
    confirmarContrasena: ''
  };

  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  async registrar() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    if (this.usuario.contrasena !== this.usuario.confirmarContrasena) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.usuario.contrasena.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        this.usuario.email,
        this.usuario.contrasena
      );

      // Guardar usuario en Firestore con datos adicionales
      await this.usuariosService.guardarUsuarioSiNoExiste(
        userCredential.user,
        {
          nombre: this.usuario.nombre,
          apellido: this.usuario.apellido,
          telefono: this.usuario.telefono
        }
      );

      // Registrar el acceso en historial-acceso con el nombre del formulario
      await this.usuariosService.registrarAcceso(
        userCredential.user,
        this.usuario.nombre  // Pasamos el nombre explícitamente
      );

      this.registerForm.resetForm();
      alert(`Registro exitoso. Bienvenido ${this.usuario.nombre}!`);
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error en registro:', error);
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  private getErrorMessage(error: any): string {
    const errorMap: Record<string, string> = {
      'auth/email-already-in-use': 'El correo electrónico ya está registrado',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'firestore/set-doc-error': 'Error al guardar los datos del usuario'
    };
    return errorMap[error.code] || 'Error en el registro. Por favor intenta nuevamente.';
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}