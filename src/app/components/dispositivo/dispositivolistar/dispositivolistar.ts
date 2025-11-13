import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Dispositivo } from '../../../models/Dispositivo';
import { Dispositivoservice } from '../../../services/dispositivoservice';

@Component({
  selector: 'app-dispositivolistar',
  imports: [MatTableModule, CommonModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './dispositivolistar.html',
  styleUrl: './dispositivolistar.css',
})
export class Dispositivolistar implements OnInit {
  dataSource: MatTableDataSource<Dispositivo> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'cforaneanombre', 'c7', 'c8']

  constructor(private dS: Dispositivoservice) {}

  ngOnInit(): void {
      this.dS.list().subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
      });

      this.dS.getList().subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
      });
      
  }

  eliminar(id: number) {
    this.dS.delete(id).subscribe(data => {
      this.dS.list().subscribe(data => {
        this.dS.setList(data)
      })
    })
  }

}
