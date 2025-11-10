import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ContenidoEducativo } from '../../../models/ContenidoEducativo';
import { Contenidoeducativoservice } from '../../../services/contenidoeducativoservice';

@Component({
  selector: 'app-contenidoeducativolistar',
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './contenidoeducativolistar.html',
  styleUrl: './contenidoeducativolistar.css',
})
export class Contenidoeducativolistar implements OnInit {

  dataSource: MatTableDataSource<ContenidoEducativo> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];

  constructor(private ceS: Contenidoeducativoservice) {}

  ngOnInit(): void {
      this.ceS.list().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      })

      // Actualiza la lista si se registra algo
      this.ceS.getList().subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
      })
  }

  // Metodo eliminar, primero elimina y luego muestra la lista actualizada
  eliminar(id: number) {
    const confirmacion = globalThis.confirm('¿Estás seguro de eliminar este contenido educativo?');
    if (confirmacion) {
      this.ceS.delete(id).subscribe(() => {
        this.ceS.list().subscribe((data) => {
          this.ceS.setList(data);
        })
      })
    }
  }

}
