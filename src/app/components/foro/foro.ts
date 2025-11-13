import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Forolistar } from "./forolistar/forolistar";
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-foro',
  imports: [RouterOutlet, Forolistar, Menu],
  templateUrl: './foro.html',
  styleUrl: './foro.css',
})
export class Foro {
  constructor(public route: ActivatedRoute){}
}
