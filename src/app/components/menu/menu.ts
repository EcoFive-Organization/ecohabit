import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { Loginservice } from '../../services/loginservice';

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
    RouterOutlet],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit{
  role: string = "";
  usuario: string = "";

  constructor(private loginService: Loginservice) {}

  ngOnInit(): void {
    // Aquí llenamos la variable role sin depender del HTML
    this.role = this.loginService.showRole();
    
    // Opcional: Para debuguear y estar segura
    console.log("Rol detectado al iniciar Menu:", this.role);
  }

  cerrar() {
    sessionStorage.clear()
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
