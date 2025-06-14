import { Injectable } from '@angular/core';
import { 
  doc, getDoc, setDoc, updateDoc, 
  collection, getDocs, deleteDoc,
  serverTimestamp, Timestamp, addDoc,
  query, orderBy
} from 'firebase/firestore';
import { db } from '../../main';
import { User } from 'firebase/auth';

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
    
    const email = user.email || user.providerData?.[0]?.email;
    if (!email) {
      throw new Error('El correo electrónico es obligatorio');
    }
    
    const usuarioNormalizado = this.normalizarDatosUsuario(user, datosAdicionales);

    try {
      const docSnap = await getDoc(usuarioRef);
      
      if (!docSnap.exists()) {
        await setDoc(usuarioRef, {
          ...usuarioNormalizado,
          fechaCreacion: serverTimestamp(),
          ultimoAcceso: serverTimestamp()
        });
      } else {
        await updateDoc(usuarioRef, {
          nombre: usuarioNormalizado.nombre,
          apellido: usuarioNormalizado.apellido,
          email: usuarioNormalizado.email,
          telefono: usuarioNormalizado.telefono,
          ultimoAcceso: serverTimestamp(),
          ...(usuarioNormalizado.photoURL && { photoURL: usuarioNormalizado.photoURL })
        });
      }
      
      const updatedDoc = await getDoc(usuarioRef);
      return updatedDoc.data() as UsuarioFirestore;
    } catch (error) {
      console.error('Error guardando usuario:', error);
      throw this.manejarErrorFirestore(error);
    }
  }

  async registrarAcceso(usuario: User, nombreUsuario: string): Promise<void> {
  try {
    await addDoc(collection(db, 'historial-acceso'), {
      userId: usuario.uid,
      email: usuario.email,
      nombre: nombreUsuario,  
      proveedor: 'email',
      fechaAcceso: serverTimestamp(),
      dispositivo: this.detectarDispositivo(),
      userAgent: navigator.userAgent
    });
  } catch (error) {
    console.error('Error registrando acceso:', error);
    throw error;
  }
}

  async obtenerHistorialAccesos(): Promise<HistorialAcceso[]> {
    try {
      const q = query(
        collection(db, 'historial-acceso'),
        orderBy('fechaAcceso', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as any
      }));
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      throw new Error('Error al obtener el historial de accesos');
    }
  }

  private obtenerProveedor(user: User): string {
    if (!user.providerData || user.providerData.length === 0) return 'email';
    const providerId = user.providerData[0].providerId;
    if (providerId.includes('google')) return 'google';
    if (providerId.includes('facebook')) return 'facebook';
    if (providerId.includes('github')) return 'github';
    return 'email';
  }

  private detectarDispositivo(): string {
    const userAgent = navigator.userAgent;
    if (/mobile/i.test(userAgent)) return 'Móvil';
    if (/tablet/i.test(userAgent)) return 'Tablet';
    if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
    if (/Android/.test(userAgent)) return 'Android';
    return 'Escritorio';
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
  }

  async actualizarUsuario(usuario: UsuarioFirestore): Promise<void> {
    try {
      if (!usuario.email) {
        throw new Error('El correo electrónico es obligatorio');
      }

      const usuarioRef = doc(db, 'usuarios', usuario.uid);
      const updateData: any = {
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        email: usuario.email,
        ultimoAcceso: serverTimestamp()
      };
      
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
  }

  private normalizarDatosUsuario(user: User, datosAdicionales?: any): UsuarioFirestore {
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
      email: email,
      nombre: datosAdicionales?.nombre || nombre,
      apellido: datosAdicionales?.apellido || apellido,
      telefono: datosAdicionales?.telefono || null,
      photoURL: user.photoURL || null,
      proveedor,
      fechaCreacion: null,
      ultimoAcceso: null
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

export interface HistorialAcceso {
  id: string;
  userId: string;
  email: string | null;
  nombre: string;
  proveedor: 'email' | 'google' | 'facebook' | 'github';
  fechaAcceso: Timestamp;
  dispositivo: string;
  userAgent: string;
  detalles?: {
    metodo?: string;
    origen?: string;
  };
}

export interface UsuarioFirestore {
  uid: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  photoURL: string | null;
  proveedor: 'email' | 'google' | 'facebook' | 'github';
  fechaCreacion: Timestamp | null;
  ultimoAcceso: Timestamp | null;
}