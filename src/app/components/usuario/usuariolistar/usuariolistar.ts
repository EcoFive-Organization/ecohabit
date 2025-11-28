import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-usuariolistar',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './usuariolistar.html',
  styleUrl: './usuariolistar.css',
})
export class Usuariolistar implements OnInit {
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];

  constructor(private uU: Usuarioservice) {}

  ngOnInit(): void {
    this.cargarDatos()
  }

  cargarDatos() {
    this.uU.list().subscribe((data) => {
      this.procesarDatos(data);
    });

    this.uU.getList().subscribe((data) => {
      this.procesarDatos(data);
    });
  }

  procesarDatos(data: Usuario[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;

    // Configuración del Filtro: Busca por nombre, email o ID
    this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
      const nombre = data.nombre?.toLowerCase() || '';
      const email = data.email?.toLowerCase() || '';
      const id = data.idUsuario.toString();

      return nombre.includes(filter) || email.includes(filter) || id.includes(filter);
    };
  }

  // Método para aplicar el filtro (HTML input)
  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // Metodo eliminar, primero elimina y luego muestra la lista actualizada
  eliminar(id: number) {
    const confirmacion = globalThis.confirm('¿Estás seguro de eliminar este registro');
    if (confirmacion) {
      this.uU.delete(id).subscribe(() => {
        this.uU.list().subscribe((data) => {
          this.uU.setList(data);
        });
      });
    }
  }
}
