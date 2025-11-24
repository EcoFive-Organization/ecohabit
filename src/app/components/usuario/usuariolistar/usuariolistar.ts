import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-usuariolistar',
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink, MatPaginatorModule],
  templateUrl: './usuariolistar.html',
  styleUrl: './usuariolistar.css',
})
export class Usuariolistar implements OnInit {

  dataSource: MatTableDataSource<Usuario>= new MatTableDataSource()

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];

  constructor(private uU: Usuarioservice) {}

  ngOnInit(): void {
      this.uU.list().subscribe(data => {
        this.dataSource = new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator
      })

      // Actualiza la lista si se registra algo
      this.uU.getList().subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator
      })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Metodo eliminar, primero elimina y luego muestra la lista actualizada
  eliminar(id: number) {
    const confirmacion = globalThis.confirm('¿Estás seguro de eliminar este registro')
    if (confirmacion) {
      this.uU.delete(id).subscribe(() => {
        this.uU.list().subscribe((data) => {
          this.uU.setList(data);
        })
      })
    }
  }


}
