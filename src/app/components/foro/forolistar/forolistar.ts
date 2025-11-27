import { Component, OnInit, ViewChild } from '@angular/core';
import { Foro } from '../../../models/Foro';
import { Foroservice } from '../../../services/foroservice';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-forolistar',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink, CommonModule, MatPaginatorModule],
  templateUrl: './forolistar.html',
  styleUrl: './forolistar.css',
})
export class Forolistar implements OnInit {
  dataSource: Foro[] = [];
  pagedData: Foro[] = [];
  pageSize = 5;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fS: Foroservice) {}

  ngOnInit(): void {
    this.fS.list().subscribe((data) => {
      this.dataSource = data;
      this.updatePagedData();
    });

    this.fS.getList().subscribe((data) => {
      this.dataSource = data;
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
  // Metodo eliminar, primero elimina y luego muestra la lista actualizada
  eliminar(id: number) {
    const confirmacion = globalThis.confirm('¿Estás seguro de eliminar este foro?');
    if (confirmacion) {
      this.fS.delete(id).subscribe(() => {
        this.fS.list().subscribe((data) => {
          this.fS.setList(data);
        });
      });
    }
  }
}
