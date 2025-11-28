import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Billetera } from '../../../models/Billetera';
import { Billeteraservice } from '../../../services/billeteraservice';
import { Loginservice } from '../../../services/loginservice';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-billeteralistar',
  imports: [MatTableModule,CommonModule,MatIconModule,MatButtonModule, MatCardModule],
  templateUrl: './billeteralistar.html',
  styleUrl: './billeteralistar.css'
})
export class Billeteralistar implements OnInit {
  dataSource: MatTableDataSource<Billetera> = new MatTableDataSource();
  displayedColumns: string[] = ['c3'];
  
  isAdmin: boolean = false;

  constructor(private bS: Billeteraservice,
    private loginService: Loginservice
  ) {}

  ngOnInit(): void {
    // 3. Si es ADMIN, agregamos la columna de Usuario ('c2')
    if (this.loginService.showRole() === 'ADMIN') {
      this.displayedColumns.splice(0, 0, 'c2');
      this.displayedColumns.splice(0, 0, 'c1');
    }

    this.isAdmin = this.loginService.showRole() === 'ADMIN'

    this.bS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.bS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }
}
