import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Recompensalistar } from './recompensalistar/recompensalistar';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-recompensa',
  imports: [RouterOutlet, Recompensalistar, Menu],
  templateUrl: './recompensa.html',
  styleUrl: './recompensa.css',
})
export class Recompensa {
  constructor(public route: ActivatedRoute){}
}
