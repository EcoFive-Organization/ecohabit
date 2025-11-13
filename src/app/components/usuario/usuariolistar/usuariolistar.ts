import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Menu } from '../../menu/menu';

@Component({
  selector: 'app-usuariolistar',
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink, Menu],
  templateUrl: './usuariolistar.html',
  styleUrl: './usuariolistar.css',
})
export class Usuariolistar implements OnInit {

  dataSource: MatTableDataSource<Usuario>= new MatTableDataSource()
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];

  constructor(private uU: Usuarioservice) {}

  ngOnInit(): void {
      this.uU.list().subscribe(data => {
        this.dataSource = new MatTableDataSource(data)
      })

      // Actualiza la lista si se registra algo
      this.uU.getList().subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
      })
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
