import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Publicacionlistar } from './publicacionlistar/publicacionlistar';

@Component({
  selector: 'app-publicacion',
  imports: [RouterOutlet, Publicacionlistar],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion {
  constructor(public route: ActivatedRoute) {}
}
