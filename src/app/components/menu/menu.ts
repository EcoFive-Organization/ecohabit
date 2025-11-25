import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterLink,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    RouterOutlet],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

}
