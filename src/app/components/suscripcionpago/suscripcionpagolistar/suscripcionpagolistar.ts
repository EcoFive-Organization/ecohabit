import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Suscripcionpago } from '../../../models/SuscripcionPago';
import { Suscripcionpagoservices } from '../../../services/suscripcionpagoservices';

@Component({
  selector: 'app-suscripcionpagolistar',
  imports: [MatTableModule,CommonModule,MatIconModule,MatButtonModule],
  templateUrl: './suscripcionpagolistar.html',
  styleUrl: './suscripcionpagolistar.css',
})
export class Suscripcionpagolistar implements OnInit {
  dataSource: MatTableDataSource<Suscripcionpago> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3','c4','c5','c6'];
  constructor(private spS: Suscripcionpagoservices){}
  ngOnInit(): void {
      this.spS.list().subscribe((data)=>{
        this.dataSource = new MatTableDataSource(data);
      });
      this.spS.getList().subscribe((data) =>{
        this.dataSource = new MatTableDataSource(data);
      });
  }
}
