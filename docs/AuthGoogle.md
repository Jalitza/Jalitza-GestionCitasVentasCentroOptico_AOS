# 🔐 Autenticación con Google - Gestión de Citas y Ventas Centro Óptico

## 📌 Descripción

Este módulo permite a los usuarios autenticarse utilizando su cuenta de Google mediante Firebase Authentication. Está implementado en un componente independiente para mantener una estructura modular y reutilizable.

---

## 🧩 Componente: `google-autenticacion`

- **Ruta**: `src/app/google-autenticacion/`
- **Selector**: `<app-google-autenticacion>`
- **Uso**: Se utiliza dentro de los componentes `Login` y `Register` para ofrecer la opción de iniciar sesión con Google.

---

## 🛠️ Implementación

### 1. Crear el componente

```bash
ng generate component google-autenticacion
```

### 2. Agregar Firebase Auth (si no está hecho)

```bash
npm install firebase
```

### 3. Configurar Firebase en el proyecto (`src/environments/environment.ts`)

```ts
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_AUTH_DOMAIN',
    projectId: 'TU_PROJECT_ID',
    storageBucket: 'TU_BUCKET',
    messagingSenderId: 'TU_SENDER_ID',
    appId: 'TU_APP_ID'
  }
};
```

### 4. Código del componente `google-autenticacion.component.ts`

```ts
import { Component } from '@angular/core';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google-autenticacion',
  templateUrl: './google-autenticacion.component.html',
  styleUrls: ['./google-autenticacion.component.css']
})
export class GoogleAutenticacionComponent {

  constructor(private router: Router) {}

  loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(result => {
        alert('✅ Autenticación con Google exitosa');
        this.router.navigate(['/home']);
      })
      .catch(error => {
        alert('❌ Error en la autenticación: ' + error.message);
      });
  }
}
```

---

## 🖼️ HTML: `google-autenticacion.component.html`

```html
<button class="google-login-btn" (click)="loginWithGoogle()">
  <img src="assets/google-icon.png" alt="Google" style="width: 20px; vertical-align: middle; margin-right: 8px;">
  Iniciar sesión con Google
</button>
```

---

## 🎨 CSS: `google-autenticacion.component.css`

```css
.google-login-btn {
  width: 100%;
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.google-login-btn:hover {
  background-color: #f1f1f1;
}
```

---

## 🔗 Integración

Agrega el selector del componente en tus formularios de login o registro:

```html
<!-- login.component.html o register.component.html -->
<app-google-autenticacion></app-google-autenticacion>
```

Y asegúrate de **importar el componente** si estás trabajando con componentes independientes (`standalone: true`):

```ts
@Component({
  standalone: true,
  imports: [CommonModule, GoogleAutenticacionComponent],
  ...
})
```

---

## ✅ Resultado

El usuario puede autenticarse usando Google y será redirigido a la pantalla principal (`/home`) si la autenticación es exitosa.

