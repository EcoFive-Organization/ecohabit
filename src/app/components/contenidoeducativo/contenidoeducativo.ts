import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Contenidoeducativolistar } from './contenidoeducativolistar/contenidoeducativolistar';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-contenidoeducativo',
  imports: [RouterOutlet, Contenidoeducativolistar, Menu],
  templateUrl: './contenidoeducativo.html',
  styleUrl: './contenidoeducativo.css',
})
export class Contenidoeducativo {
  constructor(public route: ActivatedRoute) {}
}
