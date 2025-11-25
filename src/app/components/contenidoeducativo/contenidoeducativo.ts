import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Contenidoeducativolistar } from './contenidoeducativolistar/contenidoeducativolistar';

@Component({
  selector: 'app-contenidoeducativo',
  imports: [RouterOutlet, Contenidoeducativolistar],
  templateUrl: './contenidoeducativo.html',
  styleUrl: './contenidoeducativo.css',
})
export class Contenidoeducativo {
  constructor(public route: ActivatedRoute) {}
}
