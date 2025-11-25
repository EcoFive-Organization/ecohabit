import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Transaccionlistar } from './transaccionlistar/transaccionlistar';

@Component({
  selector: 'app-transaccion',
  imports: [RouterOutlet,Transaccionlistar],
  templateUrl: './transaccion.html',
  styleUrl: './transaccion.css',
})
export class Transaccion {
  constructor(public route:ActivatedRoute){}
}
