import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Billeteralistar } from './billeteralistar/billeteralistar';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-billetera',
  imports: [RouterOutlet,Billeteralistar, Menu],
  templateUrl: './billetera.html',
  styleUrl: './billetera.css'
})
export class Billetera {
  constructor(public route:ActivatedRoute){}
}
