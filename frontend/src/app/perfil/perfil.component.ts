import { Component, OnInit } from '@angular/core';
import { getAuth, updateProfile, updatePassword, deleteUser } from 'firebase/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: true,
  imports: [FormsModule],

})
export class PerfilComponent implements OnInit {
  nombre: string = '';
  email: string = '';
  nuevaContrasena: string = '';

  ngOnInit() {
    const user = getAuth().currentUser;
    if (user) {
      this.nombre = user.displayName || '';
      this.email = user.email || '';
    }
  }

  actualizarNombre() {
    const user = getAuth().currentUser;
    if (user) {
      updateProfile(user, { displayName: this.nombre }).then(() => {
        alert('Nombre actualizado correctamente');
      }).catch(error => console.error(error));
    }
  }

  actualizarContrasena() {
    const user = getAuth().currentUser;
    if (user && this.nuevaContrasena) {
      updatePassword(user, this.nuevaContrasena).then(() => {
        alert('Contraseña actualizada correctamente');
        this.nuevaContrasena = '';
      }).catch(error => console.error(error));
    }
  }

  eliminarCuenta() {
    const user = getAuth().currentUser;
    if (user) {
      if (confirm('¿Estás segura de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
        deleteUser(user).then(() => {
          alert('Cuenta eliminada.');
          // Redirigir al login u otra página
        }).catch(error => console.error(error));
      }
    }
  }
}
