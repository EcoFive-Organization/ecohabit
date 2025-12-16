import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Publicacion } from '../../../models/Publicacion';
import { Publicacionservice } from '../../../services/publicacionservice';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../../services/loginservice';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-publicacionlistar',
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatCardModule,
    MatPaginatorModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './publicacionlistar.html',
  styleUrl: './publicacionlistar.css',
})
export class Publicacionlistar implements OnInit {
  dataSource: Publicacion[] = [];
  originalData: Publicacion[] = [];
  pagedData: Publicacion[] = [];
  pageSize = 5;
  pageIndex = 0;
  isAdmin: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private ps: Publicacionservice, private lS: Loginservice) {}

  ngOnInit(): void {
    this.isAdmin = this.lS.showRole() === 'ADMIN';

    this.ps.list().subscribe((data) => {
      this.dataSource = data;
      this.originalData = data;
      this.updatePagedData();
    });

    this.ps.getList().subscribe((data) => {
      this.dataSource = data;
      this.originalData = data;
      this.updatePagedData();
    });
  }

  updatePagedData() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.dataSource.slice(start, end);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePagedData();
  }

  eliminar(id: number) {
    const confirmacion = globalThis.confirm('¿Estás seguro de eliminar esta publicación?');
    if (confirmacion) {
      this.ps.delete(id).subscribe(() => {
        this.ps.list().subscribe((data) => {
          this.ps.setList(data);
        });
      });
    }
  }

  // NUEVA FUNCIÓN DE FILTRADO
  filtrar(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();

    if (valor.trim() === '') {
      // Si está vacío, restauramos la lista original
      this.dataSource = this.originalData;
    } else {
      // Filtramos por el nombre del usuario
      this.dataSource = this.originalData.filter((element: any) =>
        element.usuario.nombre.toLowerCase().includes(valor)
      );
    }

    // Regresamos a la primera página para ver los resultados
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.updatePagedData();
  }
}
