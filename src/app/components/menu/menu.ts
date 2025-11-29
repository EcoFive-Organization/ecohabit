import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core'; // 🟢 Importar ViewChild y TemplateRef
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule, RouterOutlet, Router } from '@angular/router'; // 🟢 Importar Router
import { Loginservice } from '../../services/loginservice';

// 🟢 Importar MatDialog y su Módulo
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterLink,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    RouterOutlet,
    MatMenuModule,
    MatDialogModule // 🟢 Módulo del Diálogo
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  role: string = "";
  usuario: string = "";

  // 🟢 Capturamos la plantilla del diálogo desde el HTML
  @ViewChild('logoutDialog') logoutDialog!: TemplateRef<any>;

  constructor(
    private loginService: Loginservice,
    private dialog: MatDialog, // 🟢 Inyectar MatDialog
    private router: Router // 🟢 Inyectar Router
  ) {}

  ngOnInit(): void {
    this.role = this.loginService.showRole();
    console.log("Rol detectado al iniciar Menu:", this.role);
  }

  // 🟢 MÉTODO 1: Abre la confirmación
  confirmarCierre() {
    const dialogRef = this.dialog.open(this.logoutDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Si el usuario confirmó, cerramos sesión
        this.cerrarSesion();
      }
    });
  }

  // 🟢 MÉTODO 2: Ejecuta el cierre real
  cerrarSesion() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  // Método antiguo (ya no se usa directamente desde el HTML, pero se mantiene la lógica dentro de cerrarSesion)
  cerrar() {
    sessionStorage.clear();
  }

  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }

  isAdmin() {
    return this.role === 'ADMIN';
  }

  isClient() {
    return this.role === 'CLIENT';
  }
}