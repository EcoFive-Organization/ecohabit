import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Dispositivo } from '../../../models/Dispositivo';
import { Dispositivoservice } from '../../../services/dispositivoservice';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Loginservice } from '../../../services/loginservice';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dispositivolistar',
  imports: [
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatPaginatorModule,
    MatCardModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './dispositivolistar.html',
  styleUrl: './dispositivolistar.css',
})
export class Dispositivolistar implements OnInit {
  allData: Dispositivo[] = [];
  dataSource: MatTableDataSource<Dispositivo> = new MatTableDataSource();
  pagedData: Dispositivo[] = []; // Para las cards

  // Paginación
  totalElements = 0;
  pageSize = 5;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isAdmin: boolean = false;
  displayedColumns: string[] = ['c1', 'c2', 'c4', 'c7', 'c8'];

  constructor(private dS: Dispositivoservice, private loginService: Loginservice) {}

  ngOnInit(): void {
    const role = this.loginService.showRole();

    this.isAdmin = role === 'ADMIN';

    // Si es ADMIN, agregamos la columna de usuario a la vista
    if (this.isAdmin) {
      // Insertamos la columna en la posición que quieras (ej: antes de editar)
      this.displayedColumns.splice(3, 0, 'cforaneanombre');
    }

    this.cargarDatos();
  }

  cargarDatos() {
    // Usamos list() o getList() según tu servicio, unificamos la carga
    this.dS.list().subscribe((data) => {
      this.procesarDatos(data);
    });

    // Suscripción al Subject para actualizaciones (si usas setList en el servicio)
    this.dS.getList().subscribe((data) => {
      this.procesarDatos(data);
    });
  }

  procesarDatos(data: Dispositivo[]) {
    this.allData = data;
    this.totalElements = data.length;

    if (this.isAdmin) {
      // --- LOGICA PARA ADMIN (TABLA) ---
      this.dataSource = new MatTableDataSource(this.allData);
      this.dataSource.paginator = this.paginator;

      // CONFIGURACIÓN DEL FILTRO PERSONALIZADO
      // Esto permite buscar por propiedades anidadas (nombre del usuario)
      this.dataSource.filterPredicate = (data: Dispositivo, filter: string) => {
        const nombreUsuario = data.usuario?.nombre?.toLowerCase() || ''; // Acceso seguro
        const nombreDispositivo = data.nombre?.toLowerCase() || '';
        const ubicacion = data.ubicacion?.toLowerCase() || '';
        const id = data.idDispositivo.toString();

        // Retorna true si alguna de las propiedades contiene el texto del filtro
        return (
          nombreUsuario.includes(filter) ||
          nombreDispositivo.includes(filter) ||
          ubicacion.includes(filter) ||
          id.includes(filter)
        );
      };
    } else {
      // --- LOGICA PARA CLIENT (CARDS) ---
      this.updatePagedData();
    }
  }

  // Método para aplicar el filtro desde el HTML
  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Evento al cambiar de página en el Paginador
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    if (this.isAdmin) {
      // La tabla se conecta sola al paginator, no necesita lógica extra aquí
    } else {
      // Actualizamos las cards manualmente
      this.updatePagedData();
    }
  }

  // Cortar el array para mostrar solo las cards de la página actual
  updatePagedData() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.allData.slice(start, end);
  }

  eliminar(id: number) {
    this.dS.delete(id).subscribe((data) => {
      this.dS.list().subscribe((data) => {
        this.dS.setList(data);
      });
    });
  }
}
