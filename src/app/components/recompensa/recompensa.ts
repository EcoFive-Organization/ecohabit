import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Recompensalistar } from './recompensalistar/recompensalistar';

@Component({
  selector: 'app-recompensa',
  imports: [RouterOutlet, Recompensalistar],
  templateUrl: './recompensa.html',
  styleUrl: './recompensa.css',
})
export class Recompensa {
  constructor(public route: ActivatedRoute){}
}
