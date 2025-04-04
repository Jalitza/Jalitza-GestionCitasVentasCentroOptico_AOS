import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './app//login/login.component';
import { RegisterComponent } from './app/register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Ruta por defecto
];

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(FormsModule), provideRouter(routes)]
}).catch(err => console.error(err));