import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // 1. Añade esta propiedad
  isMenuVisible = false;

  // 2. Añade este método
  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }
}
