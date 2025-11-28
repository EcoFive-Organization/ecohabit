import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true, // Lo marcamos como standalone
  imports: [
    RouterLink,
    MatButtonModule, 
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Variable para controlar si el menú está abierto o cerrado
  menuActive: boolean = false;

  // Función que se ejecuta al dar click en la hamburguesa
  toggleMenu() {
    this.menuActive = !this.menuActive;
  }
}