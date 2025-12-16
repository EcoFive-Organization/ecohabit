import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core'; // 🟢 Importar TemplateRef
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

// 🟢 Importar MatDialog y MatDialogModule
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

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
    MatDialogModule // 🟢 Asegúrate de importar el módulo aquí
  ],
  templateUrl: './usuariolistar.html',
  styleUrl: './usuariolistar.css',
})
export class Usuariolistar implements OnInit {
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  // 🟢 Capturamos la plantilla del diálogo desde el HTML
  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;

  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];

  constructor(
    private uU: Usuarioservice,
    private dialog: MatDialog // 🟢 Inyectamos MatDialog
  ) {}

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

    this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
      const nombre = data.nombre?.toLowerCase() || '';
      const email = data.email?.toLowerCase() || '';
      const id = data.idUsuario.toString();

      return nombre.includes(filter) || email.includes(filter) || id.includes(filter);
    };
  }

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // 🟢 MÉTODO ELIMINAR MEJORADO CON MAT-DIALOG
  eliminar(id: number) {
    // Abrimos el diálogo usando la plantilla local
    const dialogRef = this.dialog.open(this.confirmDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // El usuario confirmó la eliminación
        this.uU.delete(id).subscribe(() => {
          // Refrescamos la lista
          this.uU.list().subscribe((data) => {
            this.uU.setList(data);
            this.procesarDatos(data); // Actualizamos la tabla visualmente
          });
        });
      }
    });
  }
}