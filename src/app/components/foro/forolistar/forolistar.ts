import { Component, OnInit } from '@angular/core';
import { Foro } from '../../../models/Foro';
import { Foroservice } from '../../../services/foroservice';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forolistar',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink, CommonModule],
  templateUrl: './forolistar.html',
  styleUrl: './forolistar.css',
})
export class Forolistar implements OnInit {
  dataSource: Foro[] = [];

  constructor(private fS: Foroservice) {}

  ngOnInit(): void {
    this.fS.list().subscribe((data) => {
      this.dataSource = data;
    });

    // Actualiza la lista si se registra algo
    this.fS.getList().subscribe((data) => {
      this.dataSource = data;
    });
  }
  // Metodo eliminar, primero elimina y luego muestra la lista actualizada
  eliminar(id: number) {
    const confirmacion = globalThis.confirm('¿Estás seguro de eliminar este foro');
    if (confirmacion) {
      this.fS.delete(id).subscribe(() => {
        this.fS.list().subscribe((data) => {
          this.fS.setList(data);
        });
      });
    }
  }
}
