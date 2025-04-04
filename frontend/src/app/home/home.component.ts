import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  logout() {
    // Aquí puedes limpiar el estado de autenticación (si es necesario)
    this.router.navigate(['/login']); // Redirige al login
  }
}
