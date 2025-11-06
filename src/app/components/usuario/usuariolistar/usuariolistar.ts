import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';

@Component({
  selector: 'app-usuariolistar',
  imports: [MatTableModule],
  templateUrl: './usuariolistar.html',
  styleUrl: './usuariolistar.css',
})
export class Usuariolistar implements OnInit {

  dataSource: MatTableDataSource<Usuario>= new MatTableDataSource()
  displayedColumns: string[] = ['c1', 'c2'];

  constructor(private uU: Usuarioservice) {}

  ngOnInit(): void {
      this.uU.list().subscribe(data => {
        this.dataSource = new MatTableDataSource(data)
      })
  }


}
