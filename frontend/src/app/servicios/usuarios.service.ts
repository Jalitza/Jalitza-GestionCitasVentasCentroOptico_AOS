import { Injectable } from '@angular/core';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs,
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../../main';
import { User } from 'firebase/auth';

// Interfaz exportada para poder usarla en otros componentes
export interface UsuarioFirestore {
  uid: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  photoURL: string | null;
  proveedor: 'email' | 'google' | 'facebook' | 'github';
  fechaCreacion: string;
  ultimoAcceso: string;
  contrasena?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  async guardarUsuarioSiNoExiste(user: User, datosAdicionales?: {
    nombre?: string;
    apellido?: string;
    telefono?: string;
  }): Promise<UsuarioFirestore> {
    const usuarioRef = doc(db, 'usuarios', user.uid);
    
    // Asegurarnos de tener un email válido
    const email = user.email || user.providerData?.[0]?.email;
    if (!email) {
      throw new Error('El correo electrónico es obligatorio');
    }
    
    const usuarioNormalizado = this.normalizarDatosUsuario(user, datosAdicionales);

  try {
    const docSnap = await getDoc(usuarioRef);
    
    if (!docSnap.exists()) {
      await setDoc(usuarioRef, usuarioNormalizado);
    } else {
      await updateDoc(usuarioRef, {
        nombre: usuarioNormalizado.nombre,
        apellido: usuarioNormalizado.apellido,
        email: usuarioNormalizado.email, // Asegurar actualización del email
        telefono: usuarioNormalizado.telefono,
        ...(usuarioNormalizado.photoURL && { photoURL: usuarioNormalizado.photoURL })
      });
    }
    
    return usuarioNormalizado;
  } catch (error) {
    console.error('Error guardando usuario:', error);
    throw this.manejarErrorFirestore(error);
  }
}

  async obtenerTodosUsuarios(): Promise<UsuarioFirestore[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'usuarios'));
      return querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      } as UsuarioFirestore));
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw this.manejarErrorFirestore(error);
    }
  }  async actualizarUsuario(usuario: UsuarioFirestore): Promise<void> {
  try {
    if (!usuario.email) {
      throw new Error('El correo electrónico es obligatorio');
    }

    const usuarioRef = doc(db, 'usuarios', usuario.uid);
    const updateData: any = {
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      email: usuario.email, // El email siempre se debe actualizar
      ultimoAcceso: new Date().toISOString()
    };
    
    // Manejar teléfono: usar null si está vacío o undefined
    updateData.telefono = usuario.telefono || null;
    
    await updateDoc(usuarioRef, updateData);
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    throw this.manejarErrorFirestore(error);
  }
}

  async eliminarUsuario(uid: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'usuarios', uid));
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw this.manejarErrorFirestore(error);
    }
  }  private normalizarDatosUsuario(user: User, datosAdicionales?: any): UsuarioFirestore {
    // Obtener el email del usuario o de los datos adicionales
    const email = datosAdicionales?.email || user.email || user.providerData?.[0]?.email;
    if (!email) {
      throw new Error('El correo electrónico es obligatorio para todos los usuarios');
    }

    let nombre = '';
    let apellido = '';
    if (user.displayName) {
      const nombres = user.displayName.split(' ');
      nombre = nombres[0] || '';
      apellido = nombres.slice(1).join(' ') || '';
    }

    let proveedor: 'email' | 'google' | 'facebook' | 'github' = 'email';
    if (user.providerData && user.providerData.length > 0) {
      const providerId = user.providerData[0].providerId;
      if (providerId.includes('google')) proveedor = 'google';
      else if (providerId.includes('facebook')) proveedor = 'facebook';
      else if (providerId.includes('github')) proveedor = 'github';
    }

    return {
      uid: user.uid,
      email: user.email || '',
      nombre: datosAdicionales?.nombre || nombre,
      apellido: datosAdicionales?.apellido || apellido,
      telefono: datosAdicionales?.telefono || null,
      photoURL: user.photoURL || null,
      proveedor,
      fechaCreacion: new Date().toISOString(),
      ultimoAcceso: new Date().toISOString()
    };
  }

  private manejarErrorFirestore(error: any): { code: string; message: string } {
    return {
      code: error.code || 'firestore/unknown-error',
      message: error.message || 'Error desconocido al guardar usuario'
    };
  }

  async obtenerUsuario(uid: string): Promise<UsuarioFirestore | null> {
    try {
      const usuarioRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(usuarioRef);
      
      return docSnap.exists() ? docSnap.data() as UsuarioFirestore : null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw this.manejarErrorFirestore(error);
    }
  }
}