import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ContenidoEducativo } from '../../../models/ContenidoEducativo';
import { Contenidoeducativoservice } from '../../../services/contenidoeducativoservice';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Loginservice } from '../../../services/loginservice';

@Component({
  selector: 'app-contenidoeducativolistar',
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CommonModule,
    MatCardModule,
    MatPaginatorModule,
  ],
  templateUrl: './contenidoeducativolistar.html',
  styleUrl: './contenidoeducativolistar.css',
})
export class Contenidoeducativolistar implements OnInit {
  // Datos
  allData: ContenidoEducativo[] = []; // Mantiene copia de todo
  dataSource: ContenidoEducativo[] = []; // Datos actuales (filtrados o no)
  pagedData: ContenidoEducativo[] = []; // Datos de la página actual

  // Paginación
  totalElements = 0;
  pageSize = 5;
  pageIndex = 0;

  isAdmin: boolean = false;

  // Control de filtro activo (para estilos de botones)
  filtroActivo: 'todos' | 'lecturas' | 'videos' = 'todos';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private ceS: Contenidoeducativoservice, private loginService: Loginservice) {}

  ngOnInit(): void {
    this.isAdmin = this.loginService.showRole() === 'ADMIN';
    this.cargarTodos(); // Carga inicial

    // Suscripción a cambios (por si eliminas/editas)
    this.ceS.getList().subscribe((data) => {
      // Si estamos en un filtro, idealmente deberíamos recargar ese filtro,
      // pero por simplicidad recargamos todo o actualizamos la vista local.
      this.actualizarVista(data);
    });
  }

  // 1. Cargar TODO (Default)
  cargarTodos() {
    this.filtroActivo = 'todos';
    this.ceS.list().subscribe((data) => {
      this.actualizarVista(data);
    });
  }

  // 2. Filtrar LECTURAS
  filtrarLecturas() {
    this.filtroActivo = 'lecturas';
    this.ceS.getLecturas().subscribe((data) => {
      this.actualizarVista(data);
    });
  }

  // 3. Filtrar VIDEOS
  filtrarVideos() {
    this.filtroActivo = 'videos';
    this.ceS.getVideos().subscribe((data) => {
      this.actualizarVista(data);
    });
  }

  // Lógica central para actualizar tabla/paginador
  actualizarVista(data: ContenidoEducativo[]) {
    this.dataSource = data;
    this.totalElements = data.length;
    this.pageIndex = 0; // Reiniciar a la primera página al filtrar
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.updatePagedData();
  }

  // Evento Paginador
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedData();
  }

  updatePagedData() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.dataSource.slice(start, end);
  }

  // Metodo eliminar, primero elimina y luego muestra la lista actualizada
  eliminar(id: number) {
    const confirmacion = globalThis.confirm('¿Estás seguro de eliminar este contenido educativo?');
    if (confirmacion) {
      this.ceS.delete(id).subscribe(() => {
        this.ceS.list().subscribe((data) => {
          this.ceS.setList(data);
        });
      });
    }
  }
}
