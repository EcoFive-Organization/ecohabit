import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Suscripcionpagolistar } from './suscripcionpagolistar/suscripcionpagolistar';

@Component({
  selector: 'app-suscripcionpago',
  imports: [RouterOutlet,Suscripcionpagolistar],
  templateUrl: './suscripcionpago.html',
  styleUrl: './suscripcionpago.css',
})
export class Suscripcionpago {
  constructor(public route:ActivatedRoute){}
}
