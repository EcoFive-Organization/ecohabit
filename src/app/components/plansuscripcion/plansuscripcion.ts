import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Plansuscripcionlistar } from './plansuscripcionlistar/plansuscripcionlistar';

@Component({
  selector: 'app-plansuscripcion',
  imports: [RouterOutlet, Plansuscripcionlistar],
  templateUrl: './plansuscripcion.html',
  styleUrl: './plansuscripcion.css',
})
export class Plansuscripcion {
    constructor(public route:ActivatedRoute ) {}
}
