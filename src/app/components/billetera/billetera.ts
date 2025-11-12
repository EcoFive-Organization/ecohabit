import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Bilelteralistar } from './billeteralistar/bilelteralistar';

@Component({
  selector: 'app-billetera',
  imports: [RouterOutlet,Bilelteralistar],
  templateUrl: './billetera.html',
  styleUrl: './billetera.css'
})
export class Billetera {
  constructor(public route:ActivatedRoute){}
}
