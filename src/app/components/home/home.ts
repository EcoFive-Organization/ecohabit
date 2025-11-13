import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

// Imports añadidos desde tu menu.ts
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common'; // Para *ngIf

@Component({
  selector: 'app-home',
  standalone: true, // Lo marcamos como standalone
  imports: [
    CommonModule, // <-- Añadido
    MatButtonModule, 
    RouterLink,
    MatIconModule,    // <-- Añadido
    MatMenuModule,    // <-- Añadido
    MatToolbarModule, // <-- Añadido
    MatDividerModule  // <-- Añadido
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  
  // Esta función permite que los enlaces del menú 
  // hagan scroll suave a la sección
  scrollTo(section: string) {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }

  // Las propiedades isMenuVisible y toggleMenu() ya no son necesarias
  // MatMenu maneja esto automáticamente.
}