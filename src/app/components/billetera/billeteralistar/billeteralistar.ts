import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Billetera } from '../../../models/Billetera';
import { Billeteraservice } from '../../../services/billeteraservice';

@Component({
  selector: 'app-billeteralistar',
  imports: [MatTableModule,CommonModule,MatIconModule,MatButtonModule],
  templateUrl: './billeteralistar.html',
  styleUrl: './billeteralistar.css'
})
export class Billeteralistar implements OnInit {
  dataSource: MatTableDataSource<Billetera> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3'];

  constructor(private bS: Billeteraservice) {}

  ngOnInit(): void {
    this.bS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    
  this.bS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }
}
