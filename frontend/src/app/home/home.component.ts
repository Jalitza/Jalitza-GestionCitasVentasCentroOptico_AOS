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

  constructor(private router: Router) {}

  ngOnInit(): void {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      this.usuario = user.displayName || 'Usuario';
      console.log('Usuario autenticado:', this.usuario);
    } else {
      console.warn('No hay usuario autenticado');
      this.usuario = 'Usuario';
    }
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
}
