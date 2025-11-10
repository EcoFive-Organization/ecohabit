import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Foro } from '../../../models/Foro';
import { Foroservice } from '../../../services/foroservice';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forolistar',
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './forolistar.html',
  styleUrl: './forolistar.css',
})
export class Forolistar implements OnInit{
  dataSource: MatTableDataSource<Foro>= new MatTableDataSource()
  displayedColumns: string[]=['c1','c2','c3', 'c4','c5'];

  constructor(private fS: Foroservice){}

  ngOnInit(): void {
      this.fS.list().subscribe(data => {
        this.dataSource = new MatTableDataSource(data)
      })

      // Actualiza la lista si se registra algo
      this.fS.getList().subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
      })
  }
  // Metodo eliminar, primero elimina y luego muestra la lista actualizada
  eliminar(id: number) {
    const confirmacion = globalThis.confirm('¿Estás seguro de eliminar este foro')
    if (confirmacion) {
      this.fS.delete(id).subscribe(() => {
        this.fS.list().subscribe((data) => {
          this.fS.setList(data);
        })
      })
    }
  }
}
