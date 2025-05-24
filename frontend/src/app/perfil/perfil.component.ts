import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../main'; 

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuarios: any[] = [];
  nombre: string = '';
  correo: string = '';
  proveedor: string = '';
  idUsuario?: string;
  formularioVisible: boolean = false;
  editando: boolean = false;

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    const querySnapshot = await getDocs(collection(db, 'usuarios'));
    this.usuarios = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  abrirFormulario() {
    this.editando = false;
    this.formularioVisible = true;
    this.nombre = '';
    this.correo = '';
    this.proveedor = '';
  }

  async guardarUsuario() {
    if (this.editando && this.idUsuario) {
      const usuarioRef = doc(db, 'usuarios', this.idUsuario);
      await updateDoc(usuarioRef, {
        nombre: this.nombre,
        correo: this.correo,
        proveedor: this.proveedor
      });
    } else {
      await addDoc(collection(db, 'usuarios'), {
        nombre: this.nombre,
        correo: this.correo,
        proveedor: this.proveedor
      });
    }

    this.formularioVisible = false;
    this.nombre = '';
    this.correo = '';
    this.proveedor = '';
    this.editando = false;
    this.idUsuario = undefined;

    await this.cargarUsuarios();
  }

  editarUsuario(usuario: any) {
    this.nombre = usuario.nombre;
    this.correo = usuario.correo;
    this.proveedor = usuario.proveedor;
    this.idUsuario = usuario.id;
    this.formularioVisible = true;
    this.editando = true;
  }

  async eliminarUsuario(id: string) {
    await deleteDoc(doc(db, 'usuarios', id));
    await this.cargarUsuarios();
  }

  cancelar() {
    this.formularioVisible = false;
    this.editando = false;
    this.idUsuario = undefined;
  }
}
