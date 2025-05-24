# Autenticación con GitHub

## Descripción

Este módulo permite a los usuarios iniciar sesión en la aplicación utilizando su cuenta de GitHub, aprovechando OAuth 2.0 para una autenticación segura y moderna.

## Creación del componente

Se creó un componente independiente para gestionar la autenticación con GitHub:

```bash
ng generate component github-autenticacion
```

## Estructura del componente

### HTML (`github-autenticacion.component.html`)

```html
<button class="github-btn">
  <img src="assets/github-icon.png" alt="GitHub icon" class="icon" />
  Iniciar sesión con GitHub
</button>
```

### CSS (`github-autenticacion.component.css`)

```css
.github-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
}

.github-btn:hover {
  background-color: #24292e;
}

.icon {
  width: 20px;
  height: 20px;
}
```

## Registro de la app en GitHub

1. Ir a: [https://github.com/settings/applications/new](https://github.com/settings/applications/new)
2. Completar los siguientes campos:
   - **Nombre de la aplicación**: `AOSGC`
   - **URL de la página de inicio**: `http://localhost:4200/`
   - **URL de devolución de llamada de autorización**: `http://localhost:4200/login`
3. Hacer clic en **"Solicitud de registro"**.

Esto generará un `Client ID` y un `Client Secret` que pueden utilizarse en tu sistema de autenticación (por ejemplo, Firebase o backend personalizado).

## Inclusión del componente

En `login.component.html`, se agregó:

```html
<app-github-autenticacion></app-github-autenticacion>
```

Y para evitar errores como `is not a known element`, se debe asegurar que el componente esté correctamente importado en el módulo correspondiente (`app.module.ts` o uno específico si está usando lazy loading).

