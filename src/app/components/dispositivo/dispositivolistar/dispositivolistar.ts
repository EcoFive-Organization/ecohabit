import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core'; // 🟢 Importar TemplateRef
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Dispositivo } from '../../../models/Dispositivo';
import { Dispositivoservice } from '../../../services/dispositivoservice';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Loginservice } from '../../../services/loginservice';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// 🟢 Importar MatDialog
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dispositivolistar',
  imports: [
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatPaginatorModule,
    MatCardModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule // 🟢 Asegúrate de importar el módulo aquí
  ],
  templateUrl: './dispositivolistar.html',
  styleUrl: './dispositivolistar.css',
})
export class Dispositivolistar implements OnInit {
  allData: Dispositivo[] = [];
  dataSource: MatTableDataSource<Dispositivo> = new MatTableDataSource();
  pagedData: Dispositivo[] = [];

  totalElements = 0;
  pageSize = 5;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  // 🟢 Capturamos la plantilla del diálogo del HTML
  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;

  isAdmin: boolean = false;
  displayedColumns: string[] = ['c1', 'c2', 'c4', 'c7', 'c8'];

  constructor(
    private dS: Dispositivoservice, 
    private loginService: Loginservice,
    private dialog: MatDialog // 🟢 Inyectamos MatDialog
  ) {}

  ngOnInit(): void {
    const role = this.loginService.showRole();
    this.isAdmin = role === 'ADMIN';

    if (this.isAdmin) {
      this.displayedColumns.splice(3, 0, 'cforaneanombre');
    }

    this.cargarDatos();
  }

  cargarDatos() {
    this.dS.list().subscribe((data) => {
      this.procesarDatos(data);
    });

    this.dS.getList().subscribe((data) => {
      this.procesarDatos(data);
    });
  }

  procesarDatos(data: Dispositivo[]) {
    this.allData = data;
    this.totalElements = data.length;

    if (this.isAdmin) {
      this.dataSource = new MatTableDataSource(this.allData);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = (data: Dispositivo, filter: string) => {
        const nombreUsuario = data.usuario?.nombre?.toLowerCase() || '';
        const nombreDispositivo = data.nombre?.toLowerCase() || '';
        const ubicacion = data.ubicacion?.toLowerCase() || '';
        const id = data.idDispositivo.toString();

        return (
          nombreUsuario.includes(filter) ||
          nombreDispositivo.includes(filter) ||
          ubicacion.includes(filter) ||
          id.includes(filter)
        );
      };
    } else {
      this.updatePagedData();
    }
  }

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    if (!this.isAdmin) {
      this.updatePagedData();
    }
  }

  updatePagedData() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.allData.slice(start, end);
  }

  // 🟢 MÉTODO ELIMINAR CON CONFIRMACIÓN
  eliminar(id: number) {
    // Abrimos el diálogo usando la plantilla local
    const dialogRef = this.dialog.open(this.confirmDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Si el usuario confirmó, procedemos a eliminar
        this.dS.delete(id).subscribe(() => {
          // Refrescamos la lista llamando al servicio de nuevo
          this.dS.list().subscribe((data) => {
            this.dS.setList(data);
            // También actualizamos la vista local por si acaso
            this.procesarDatos(data); 
          });
        });
      }
    });
  }
}