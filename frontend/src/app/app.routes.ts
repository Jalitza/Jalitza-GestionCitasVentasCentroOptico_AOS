import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component'; // Importa el componente

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige a login por defecto
  { path: 'login', component: LoginComponent } // Ruta que carga login.component.html
];
