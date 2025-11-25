import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Consumolistar } from './consumolistar/consumolistar';

@Component({
  selector: 'app-consumo',
  imports: [RouterOutlet, Consumolistar],
  templateUrl: './consumo.html',
  styleUrl: './consumo.css',
})
export class Consumo {
  constructor(public route: ActivatedRoute) {}
}
