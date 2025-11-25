import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Suscripcionlistar } from './suscripcionlistar/suscripcionlistar';

@Component({
  selector: 'app-suscripcion',
  imports: [RouterOutlet, Suscripcionlistar],
  templateUrl: './suscripcion.html',
  styleUrl: './suscripcion.css',
})
export class Suscripcion {
  constructor(public route: ActivatedRoute) {}
}
