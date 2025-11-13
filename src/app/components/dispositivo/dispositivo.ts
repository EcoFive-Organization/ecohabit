import { Component } from '@angular/core';
import { Dispositivolistar } from './dispositivolistar/dispositivolistar';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-dispositivo',
  imports: [RouterOutlet, Dispositivolistar, Menu],
  templateUrl: './dispositivo.html',
  styleUrl: './dispositivo.css',
})
export class Dispositivo {
  constructor(public route: ActivatedRoute) {}
}
