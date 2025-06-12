# 🔐 Autenticación con Facebook

## 🔍 Descripción

En este proyecto desarrollado con **Angular** y **Firebase**, se implementó la autenticación con Facebook utilizando **Firebase Authentication**. Esta funcionalidad permite a los usuarios iniciar sesión con su cuenta de Facebook de forma rápida y segura, evitando la necesidad de crear una cuenta específica para el sistema.

Además, se almacena la información del usuario autenticado en **Cloud Firestore**, permitiendo mantener un registro centralizado de los usuarios que acceden al sistema.

---

## ⚙️ Tecnologías Utilizadas

| Tecnología         | Propósito                                  |
|--------------------|---------------------------------------------|
| Angular            | Desarrollo del frontend                     |
| Firebase Auth      | Autenticación con Facebook                  |
| Cloud Firestore    | Almacenamiento de información del usuario   |

---

## 🔧 Configuración Inicial en Firebase

1. En la [Consola de Firebase](https://console.firebase.google.com/):
   - Dirígete a **Authentication > Sign-in method**.
   - Habilita **Facebook** como proveedor.
   - Configura el **App ID** y **App Secret** obtenidos desde [Meta for Developers](https://developers.facebook.com/).
   - Agrega la **URL de redirección autorizada** proporcionada por Firebase.

---

## 🔄 Flujo de Autenticación

1. El usuario hace clic en el botón **"Iniciar sesión con Facebook"**.
2. Se ejecuta `signInWithPopup(auth, provider)` para iniciar sesión con una ventana emergente.
3. Si la autenticación es exitosa, se obtiene la información del usuario.
4. Se guarda el usuario en Firestore (si aún no existe) usando `setDoc`.
5. El usuario es redirigido automáticamente a la ruta `/home`.

---

## 📄 Código Relevante

```ts
async loginWithFacebook() {
  const provider = new FacebookAuthProvider();
  const auth = getAuth();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await setDoc(doc(this.db, 'usuarios', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      providerId: user.providerId,
      lastLogin: new Date()
    });

    this.router.navigate(['/home']);
  } catch (error) {
    console.error('Error en la autenticación con Facebook:', error);
  }
}
