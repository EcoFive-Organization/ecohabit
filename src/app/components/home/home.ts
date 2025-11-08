import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
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
