import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { UsuariosService } from '../servicios/usuarios.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    proveedor: 'email' as 'email' | 'google' | 'facebook' | 'github',
    photoURL: ''
  };

  editando: boolean = false;
  loading: boolean = true;
  auth = getAuth();
  uid: string | null = null;

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  async ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.uid = user.uid;
        await this.cargarDatosUsuario();
      } else {
        this.router.navigate(['/login']);
      }
      this.loading = false;
    });
  }

  async cargarDatosUsuario() {
    if (!this.uid) return;

    try {
      const usuarioData = await this.usuariosService.obtenerUsuario(this.uid);
      if (usuarioData) {
        this.usuario = {
          nombre: usuarioData.nombre,
          apellido: usuarioData.apellido,
          email: usuarioData.email,
          telefono: usuarioData.telefono || '',
          proveedor: usuarioData.proveedor,
          photoURL: usuarioData.photoURL || ''
        };
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar los datos del usuario');
    }
  }

  iniciarEdicion() {
    this.editando = true;
  }

  cancelarEdicion() {
    this.editando = false;
    this.cargarDatosUsuario();
  }

  async guardarCambios() {
    if (!this.uid) return;

    try {
      await this.usuariosService.actualizarUsuario({
        uid: this.uid,
        email: this.usuario.email,
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        telefono: this.usuario.telefono,
        photoURL: this.usuario.photoURL,
        proveedor: this.usuario.proveedor,
        fechaCreacion: null, // El servicio manejará esto
        ultimoAcceso: null  // Se actualizará automáticamente con serverTimestamp()
      });
      
      alert('Perfil actualizado correctamente');
      this.editando = false;
      await this.cargarDatosUsuario(); // Recargar datos actualizados
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      alert('Error al actualizar el perfil');
    }
  }
}