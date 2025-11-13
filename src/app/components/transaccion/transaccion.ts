import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Transaccionlistar } from './transaccionlistar/transaccionlistar';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-transaccion',
  imports: [RouterOutlet,Transaccionlistar, Menu],
  templateUrl: './transaccion.html',
  styleUrl: './transaccion.css',
})
export class Transaccion {
  constructor(public route:ActivatedRoute){}
}
