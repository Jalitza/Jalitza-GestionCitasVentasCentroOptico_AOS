import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  usuario: string = '';
  esAdmin: boolean = false; // Nueva propiedad para control de acceso

  constructor(private router: Router) {}

  ngOnInit(): void {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      this.usuario = user.displayName || 'Usuario';
      console.log('Usuario autenticado:', this.usuario);
      // Verificar si es administrador (ajusta según tu lógica)
      this.esAdmin = this.verificarAdmin(user);
    } else {
      console.warn('No hay usuario autenticado');
      this.usuario = 'Usuario';
    }
  }

  private verificarAdmin(user: any): boolean {
    // Implementa tu lógica para verificar si es admin
    // Ejemplo básico:
    return user.email === 'admin@opticopdn.com';
    // En una app real, deberías verificar claims o roles en Firebase
  }

  logout(): void {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log('Sesión cerrada');
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }

  irAlPerfil() {
    this.router.navigate(['/perfil']);
  }

  irAlAdministrador() {
    this.router.navigate(['/admin/usuarios']); // Asegúrate que coincide con tu ruta
  }

  irAlHistorial() {
    this.router.navigate(['/historial']);
  }
}