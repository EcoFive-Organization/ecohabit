import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Recompensa } from '../../../models/Recompensa';
import { Recompensaservice } from '../../../services/recompensaservice';

@Component({
  selector: 'app-recompensalistar',
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './recompensalistar.html',
  styleUrl: './recompensalistar.css',
})
export class Recompensalistar implements OnInit {
  dataSource: MatTableDataSource<Recompensa>= new MatTableDataSource()
  displayedColumns: string[]=['c1','c2','c3', 'c4','c5','c6'];

  constructor(private rS: Recompensaservice){}

  ngOnInit(): void {
      this.rS.list().subscribe(data => {
        this.dataSource = new MatTableDataSource(data)
      })

      // Actualiza la lista si se registra algo
      this.rS.getList().subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
      })
  }

  // Metodo eliminar, primero elimina y luego muestra la lista actualizada
  eliminar(id: number) {
    const confirmacion = globalThis.confirm('¿Estás seguro de eliminar esta recompensa')
    if (confirmacion) {
      this.rS.delete(id).subscribe(() => {
        this.rS.list().subscribe((data) => {
          this.rS.setList(data);
        })
      })
    }
  }
}
