import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Recompensa } from '../../../models/Recompensa';
import { Recompensaservice } from '../../../services/recompensaservice';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-recompensalistar',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatCardModule,
    MatPaginatorModule,
    CommonModule,
    MatDividerModule
  ],
  templateUrl: './recompensalistar.html',
  styleUrl: './recompensalistar.css',
})
export class Recompensalistar implements OnInit {
  dataSource: Recompensa[] = [];
  pagedData: Recompensa[] = [];
  pageSize = 5;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private rS: Recompensaservice) {}

  ngOnInit(): void {
    this.rS.list().subscribe((data) => {
      this.dataSource = data;
      this.updatePagedData()
    });

    // Actualiza la lista si se registra algo
    this.rS.getList().subscribe((data) => {
      this.dataSource = data;
      this.updatePagedData()
    });
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
    const confirmacion = globalThis.confirm('¿Estás seguro de eliminar esta recompensa');
    if (confirmacion) {
      this.rS.delete(id).subscribe(() => {
        this.rS.list().subscribe((data) => {
          this.rS.setList(data);
        });
      });
    }
  }
}
