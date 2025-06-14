import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService, HistorialAcceso } from '../servicios/usuarios.service';
import { FormsModule } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';

@Component({
  standalone: true,
  selector: 'app-historial',
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  accesos: HistorialAcceso[] = [];
  loading: boolean = true;
  error: string | null = null;
  filtro: string = '';

  constructor(private usuariosService: UsuariosService) {}

  async ngOnInit() {
    await this.cargarHistorial();
  }

  async cargarHistorial() {
    this.loading = true;
    try {
      this.accesos = await this.usuariosService.obtenerHistorialAccesos();
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Error al cargar el historial';
    } finally {
      this.loading = false;
    }
  }

  get accesosFiltrados() {
    if (!this.filtro) return this.accesos;
    const termino = this.filtro.toLowerCase();
    return this.accesos.filter(acceso => 
      (acceso.email?.toLowerCase().includes(termino) ?? false) ||
      (acceso.nombre?.toLowerCase().includes(termino) ?? false) ||
      acceso.proveedor.toLowerCase().includes(termino) ||
      acceso.dispositivo.toLowerCase().includes(termino)
    );
  }

  formatearFecha(fecha: Timestamp): string {
    return fecha.toDate().toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  limpiarFiltro() {
    this.filtro = '';
  }
}