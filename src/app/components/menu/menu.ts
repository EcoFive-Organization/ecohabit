import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [MatIconModule, MatButtonModule, MatToolbarModule, MatMenuModule, RouterLink, RouterModule, MatSidenavModule, MatListModule, MatExpansionModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

}
