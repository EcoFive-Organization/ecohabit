import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Metodopagolistar } from './metodopagolistar/metodopagolistar';

@Component({
  selector: 'app-metodopago',
  imports: [RouterOutlet, Metodopagolistar],
  templateUrl: './metodopago.html',
  styleUrl: './metodopago.css',
})
export class Metodopago {
  constructor(public route: ActivatedRoute) {}
}
