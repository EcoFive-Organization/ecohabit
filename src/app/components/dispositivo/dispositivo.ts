import { Component } from '@angular/core';
import { Dispositivolistar } from './dispositivolistar/dispositivolistar';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dispositivo',
  imports: [RouterOutlet, Dispositivolistar],
  templateUrl: './dispositivo.html',
  styleUrl: './dispositivo.css',
})
export class Dispositivo {
  constructor(public route: ActivatedRoute) {}
}
