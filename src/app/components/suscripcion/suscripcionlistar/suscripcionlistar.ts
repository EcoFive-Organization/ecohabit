import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Suscripcion } from '../../../models/Suscripcion';
import { Suscripcionservice } from '../../../services/suscripcionservice';

@Component({
  selector: 'app-suscripcionlistar',
  imports: [MatTableModule, CommonModule, MatIconModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './suscripcionlistar.html',
  styleUrl: './suscripcionlistar.css',
})
export class Suscripcionlistar implements OnInit {
  dataSource: MatTableDataSource<Suscripcion> = new MatTableDataSource()

  @ViewChild(MatPaginator) paginator!: MatPaginator

  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']

  constructor(private sS: Suscripcionservice) { }
  
  ngOnInit(): void {
    this.sS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator
    })

    this.sS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator
    })
  }

}
