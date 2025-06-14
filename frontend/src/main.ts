import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRouter, Routes } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { HomeComponent } from './app/home/home.component';
import { PerfilComponent } from './app/perfil/perfil.component';
import { RecuperarPasswordComponent } from './app/recuperar-password/recuperar-password.component';
import { UsuariosCrudComponent } from './app/usuarios-crud/usuarios-crud.component'; // Nueva importación
import { HistorialComponent  } from  './app/historial/historial.component';
const firebaseConfig = {
  apiKey: "AIzaSyB9Kk7S_QFpe9dJHdxTFH1KIMNtze2B4Qw",
  authDomain: "aosgc-jc.firebaseapp.com",
  projectId: "aosgc-jc",
  storageBucket: "aosgc-jc.appspot.com",
  messagingSenderId: "108870459409",
  appId: "1:108870459409:web:c082845cedb125a36991b0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  { 
    path: 'admin/usuarios', 
    component: UsuariosCrudComponent,
    // canActivate: [AuthGuard] // Descomenta cuando tengas el guard implementado
  },
  {path: 'historial', component: HistorialComponent}, // Nueva ruta para Historial
  
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(FormsModule), 
    provideRouter(routes),
    // Aquí podrías agregar otros providers necesarios
  ]
}).catch(err => console.error(err));