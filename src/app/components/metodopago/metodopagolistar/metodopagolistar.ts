import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MetodoPago } from '../../../models/MetodoPago';
import { Metodopagoservice } from '../../../services/metodopagoservice';
import { M } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-metodopagolistar',
  imports: [MatIconModule, CommonModule, MatCardModule, MatPaginatorModule],
  templateUrl: './metodopagolistar.html',
  styleUrl: './metodopagolistar.css',
})
export class Metodopagolistar implements OnInit {
  dataSource: MetodoPago[] = [];
  pagedData: MetodoPago[] = [];
  pageSize = 5;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private mpS: Metodopagoservice) {}

  ngOnInit(): void {
    this.mpS.list().subscribe((data) => {
      this.dataSource = data;
      this.updatePagedData();
    });

    // Actualiza la lista si se registra algo
    this.mpS.getList().subscribe((data) => {
      this.dataSource = data;
      this.updatePagedData();
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
}
