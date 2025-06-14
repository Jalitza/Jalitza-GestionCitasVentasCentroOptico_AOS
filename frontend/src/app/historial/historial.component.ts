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
  fechaSeleccionada: string = '';
  mostrarFiltroFecha: boolean = false;
  filtrosActivos: boolean = false;
  readonly Math = Math;


  // Propiedades de paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  paginas: number[] = [];

  constructor(private usuariosService: UsuariosService) {}

  async ngOnInit() {
    await this.cargarHistorial();
  }

  async cargarHistorial() {
    this.loading = true;
    try {
      this.accesos = await this.usuariosService.obtenerHistorialAccesos();
      this.actualizarEstadoFiltros();
      this.actualizarPaginas();
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Error al cargar el historial';
    } finally {
      this.loading = false;
    }
  }

  get accesosFiltrados() {
    if (!this.filtro && !this.fechaSeleccionada) {
      return this.accesos;
    }

    const termino = this.filtro.toLowerCase();
    const fechaObj = this.fechaSeleccionada ? new Date(this.fechaSeleccionada) : null;

    return this.accesos.filter(acceso => {
      // Filtro por texto
      const coincideTexto = !this.filtro || 
        (acceso.email?.toLowerCase().includes(termino) ?? false) ||
        (acceso.nombre?.toLowerCase().includes(termino) ?? false) ||
        acceso.proveedor.toLowerCase().includes(termino) ||
        acceso.dispositivo.toLowerCase().includes(termino);

      // Filtro por fecha (ajustado para zona horaria local UTC-5)
      let coincideFecha = true;
      if (fechaObj) {
        const fechaAjustada = new Date(fechaObj);
        fechaAjustada.setHours(fechaAjustada.getHours() + 5);
        
        const inicioDia = new Date(fechaAjustada);
        inicioDia.setHours(0, 0, 0, 0);
        
        const finDia = new Date(fechaAjustada);
        finDia.setHours(23, 59, 59, 999);

        const fechaAcceso = acceso.fechaAcceso.toDate();
        coincideFecha = fechaAcceso >= inicioDia && fechaAcceso <= finDia;
      }

      return coincideTexto && coincideFecha;
    });
  }

  get accesosPaginados() {
    const startIndex = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.accesosFiltrados.slice(startIndex, startIndex + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.accesosFiltrados.length / this.itemsPorPagina);
  }

  formatearFecha(fecha: Timestamp): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Bogota'
    };
    return fecha.toDate().toLocaleString('es-ES', options);
  }

  formatearFechaCorta(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    });
  }

  limpiarFiltros() {
    this.filtro = '';
    this.fechaSeleccionada = '';
    this.actualizarEstadoFiltros();
  }

  toggleFiltroFecha() {
    this.mostrarFiltroFecha = !this.mostrarFiltroFecha;
    if (!this.mostrarFiltroFecha) {
      this.fechaSeleccionada = '';
    }
    this.actualizarEstadoFiltros();
  }

  actualizarEstadoFiltros() {
    this.filtrosActivos = !!this.filtro || !!this.fechaSeleccionada;
    this.paginaActual = 1;
    this.actualizarPaginas();
  }

  onFechaChange() {
    this.actualizarEstadoFiltros();
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPaginas();
  }

  cambiarItemsPorPagina() {
    this.paginaActual = 1;
    this.actualizarPaginas();
  }

  actualizarPaginas() {
    const paginasMostradas = 5;
    const mitad = Math.floor(paginasMostradas / 2);
    let inicio = Math.max(1, this.paginaActual - mitad);
    let fin = Math.min(this.totalPaginas, inicio + paginasMostradas - 1);

    if (fin - inicio + 1 < paginasMostradas) {
      inicio = Math.max(1, fin - paginasMostradas + 1);
    }

    this.paginas = [];
    for (let i = inicio; i <= fin; i++) {
      this.paginas.push(i);
    }
  }
}