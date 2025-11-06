import { Component, signal } from '@angular/core';
import { Usuario } from './components/usuario/usuario';

@Component({
  selector: 'app-root',
  imports: [Usuario],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecohabit');
}
