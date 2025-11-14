import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ContenidoEducativo } from '../../../models/ContenidoEducativo';
import { Contenidoeducativoservice } from '../../../services/contenidoeducativoservice';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-contenidoeducativolistar',
  imports: [MatButtonModule, MatIconModule, RouterLink, CommonModule, MatCardModule, MatPaginatorModule],
  templateUrl: './contenidoeducativolistar.html',
  styleUrl: './contenidoeducativolistar.css',
})
export class Contenidoeducativolistar implements OnInit {

  dataSource: ContenidoEducativo[] = [];
  pagedData: ContenidoEducativo[] = [];
  pageSize = 5;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private ceS: Contenidoeducativoservice) {}

  ngOnInit(): void {
      this.ceS.list().subscribe(data => {
        this.dataSource = data;
        this.updatePagedData();
      })

      // Actualiza la lista si se registra algo
      this.ceS.getList().subscribe((data) => {
        this.dataSource = data;
        this.updatePagedData();
      })
  }

  // Para el paginator
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

  // Metodo eliminar, primero elimina y luego muestra la lista actualizada
  eliminar(id: number) {
    const confirmacion = globalThis.confirm('¿Estás seguro de eliminar este contenido educativo?');
    if (confirmacion) {
      this.ceS.delete(id).subscribe(() => {
        this.ceS.list().subscribe((data) => {
          this.ceS.setList(data);
        })
      })
    }
  }

}
