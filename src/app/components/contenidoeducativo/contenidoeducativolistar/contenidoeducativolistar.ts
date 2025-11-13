import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ContenidoEducativo } from '../../../models/ContenidoEducativo';
import { Contenidoeducativoservice } from '../../../services/contenidoeducativoservice';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-contenidoeducativolistar',
  imports: [MatButtonModule, MatIconModule, RouterLink, CommonModule, MatCardModule],
  templateUrl: './contenidoeducativolistar.html',
  styleUrl: './contenidoeducativolistar.css',
})
export class Contenidoeducativolistar implements OnInit {

  dataSource: ContenidoEducativo[] = [];

  constructor(private ceS: Contenidoeducativoservice) {}

  ngOnInit(): void {
      this.ceS.list().subscribe(data => {
        this.dataSource = data;
      })

      // Actualiza la lista si se registra algo
      this.ceS.getList().subscribe((data) => {
        this.dataSource = data;
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
