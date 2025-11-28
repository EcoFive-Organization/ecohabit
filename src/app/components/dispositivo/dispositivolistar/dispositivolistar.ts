import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Dispositivo } from '../../../models/Dispositivo';
import { Dispositivoservice } from '../../../services/dispositivoservice';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Loginservice } from '../../../services/loginservice';

@Component({
  selector: 'app-dispositivolistar',
  imports: [MatTableModule, CommonModule, MatIconModule, MatButtonModule, RouterLink, MatPaginatorModule],
  templateUrl: './dispositivolistar.html',
  styleUrl: './dispositivolistar.css',
})
export class Dispositivolistar implements OnInit {
  dataSource: MatTableDataSource<Dispositivo> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['c1', 'c2', 'c4', 'c7', 'c8']

  constructor(private dS: Dispositivoservice, private loginService: Loginservice ) {}

  ngOnInit(): void {
    const role = this.loginService.showRole();

    // Si es ADMIN, agregamos la columna de usuario a la vista
    if (role === 'ADMIN') {
      // Insertamos la columna en la posición que quieras (ej: antes de editar)
      this.displayedColumns.splice(3, 0, 'cforaneanombre');
    }

    this.dS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });

    this.dS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  eliminar(id: number) {
    this.dS.delete(id).subscribe(data => {
      this.dS.list().subscribe(data => {
        this.dS.setList(data)
      })
    })
  }

}
