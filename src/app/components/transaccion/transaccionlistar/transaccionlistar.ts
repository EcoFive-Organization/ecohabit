import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Transaccion } from '../../../models/Transaccion';
import { Transaccionservice } from '../../../services/transaccionservice';
import { Loginservice } from '../../../services/loginservice';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-transaccionlistar',
  imports: [MatTableModule,CommonModule,MatIconModule,MatButtonModule,RouterLink, MatPaginatorModule],
  templateUrl: './transaccionlistar.html',
  styleUrl: './transaccionlistar.css',
})
export class Transaccionlistar implements OnInit{
  dataSource: MatTableDataSource<Transaccion> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator
  displayedColumns: string[] = ['c3', 'c4', 'c5'];

  isAdmin: boolean = false;

  constructor(private tS: Transaccionservice,
    private loginService: Loginservice
  ) {}

  ngOnInit(): void {

    this.isAdmin = this.loginService.showRole() === 'ADMIN';

    if (this.isAdmin) {
      // Si es Admin, ve usuario y acciones
      this.displayedColumns.splice(0, 0, 'c1');
      this.displayedColumns.splice(1, 0, 'c2'); // Insertar columna Usuario
      this.displayedColumns.push('c6', 'c7'); // Insertar Editar/Eliminar
    }

    this.tS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });

    
  this.tS.getList().subscribe((data) => {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    });
  }

  eliminar(id:number){
    this.tS.delete(id).subscribe(data=>{
      this.tS.list().subscribe(data=>{
        this.tS.setList(data)
      })
    })
  }

}
