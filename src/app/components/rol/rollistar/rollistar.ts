import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Rol } from '../../../models/Rol';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Rolservice } from '../../../services/rolservice';

@Component({
  selector: 'app-rollistar',
  imports: [MatTableModule,MatPaginatorModule, MatIconModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './rollistar.html',
  styleUrl: './rollistar.css',
})
export class Rollistar implements OnInit{
  dataSource: MatTableDataSource<Rol> = new MatTableDataSource()

  @ViewChild(MatPaginator) paginator!: MatPaginator

  displayedColumns: string[] = ['c1', 'c2', 'c3']

  constructor(private rS: Rolservice){}

  ngOnInit(): void {
    this.rS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator
    })

    this.rS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator
    })
  }
}
