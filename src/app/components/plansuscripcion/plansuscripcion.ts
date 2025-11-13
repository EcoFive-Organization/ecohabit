import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Plansuscripcionlistar } from './plansuscripcionlistar/plansuscripcionlistar';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-plansuscripcion',
  imports: [RouterOutlet, Plansuscripcionlistar, Menu],
  templateUrl: './plansuscripcion.html',
  styleUrl: './plansuscripcion.css',
})
export class Plansuscripcion {
    constructor(public route:ActivatedRoute ) {}
}
