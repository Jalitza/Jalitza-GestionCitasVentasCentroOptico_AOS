import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuariosService } from '../servicios/usuarios.service';
import { UsuarioFirestore } from '../servicios/usuarios.service';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-usuarios-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './usuarios-crud.component.html',
  styleUrls: ['./usuarios-crud.component.css']
})
export class UsuariosCrudComponent implements OnInit {
  usuarios: UsuarioFirestore[] = [];
  usuarioEditando: UsuarioFirestore | null = null;
  modoEdicion: boolean = false;
  loading: boolean = true;
  error: string | null = null;
  
  // Nuevas propiedades para el formulario de agregar usuario
  mostrarFormularioAgregar: boolean = false;
  nuevoUsuario = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    contrasena: '',
    confirmarContrasena: ''
  };

  constructor(private usuariosService: UsuariosService) {}

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.loading = true;
    try {
      this.usuarios = await this.usuariosService.obtenerTodosUsuarios();
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      this.error = 'Error al cargar usuarios';
    } finally {
      this.loading = false;
    }
  }

  // Método para mostrar/ocultar el formulario de agregar usuario
  toggleAgregarUsuario() {
    this.mostrarFormularioAgregar = !this.mostrarFormularioAgregar;
    if (!this.mostrarFormularioAgregar) {
      this.resetearFormularioAgregar();
    }
  }

  resetearFormularioAgregar() {
    this.nuevoUsuario = {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      contrasena: '',
      confirmarContrasena: ''
    };
    this.error = null;
  }

  async agregarUsuario() {
    // Validaciones básicas
    if (!this.nuevoUsuario.email || !this.nuevoUsuario.contrasena) {
      this.error = 'Email y contraseña son requeridos';
      return;
    }

    if (this.nuevoUsuario.contrasena !== this.nuevoUsuario.confirmarContrasena) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        this.nuevoUsuario.email,
        this.nuevoUsuario.contrasena
      );

      await this.usuariosService.guardarUsuarioSiNoExiste(
        userCredential.user,
        {
          nombre: this.nuevoUsuario.nombre,
          apellido: this.nuevoUsuario.apellido,
          telefono: this.nuevoUsuario.telefono
        }
      );

      // Recargar la lista de usuarios
      await this.cargarUsuarios();
      this.mostrarFormularioAgregar = false;
      this.resetearFormularioAgregar();
    } catch (error: any) {
      console.error('Error al agregar usuario:', error);
      this.error = this.getErrorMessage(error);
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
      'firestore/set-doc-error': 'Error al guardar los datos del usuario'
    };
    return errorMap[error.code] || 'Error al agregar el usuario. Por favor intenta nuevamente.';
  }
  editarUsuario(usuario: UsuarioFirestore) {
    // Asegurar que todos los campos tengan valores válidos
    this.usuarioEditando = { 
      ...usuario,
      telefono: usuario.telefono || '',  // Convertir null a string vacío para el input
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      email: usuario.email || ''
    };
    this.modoEdicion = true;
  }

  cancelarEdicion() {
    this.usuarioEditando = null;
    this.modoEdicion = false;
  }

  async guardarCambios() {
    if (!this.usuarioEditando) return;

    try {
      await this.usuariosService.actualizarUsuario(this.usuarioEditando);
      this.cancelarEdicion();
      await this.cargarUsuarios();
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      this.error = 'Error al actualizar usuario';
    }
  }

  async eliminarUsuario(uid: string) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await this.usuariosService.eliminarUsuario(uid);
      await this.cargarUsuarios();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      this.error = 'Error al eliminar usuario';
    }
  }
}