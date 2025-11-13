import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Billeteralistar } from './billeteralistar/billeteralistar';

@Component({
  selector: 'app-billetera',
  imports: [RouterOutlet,Billeteralistar],
  templateUrl: './billetera.html',
  styleUrl: './billetera.css'
})
export class Billetera {
  constructor(public route:ActivatedRoute){}
}
