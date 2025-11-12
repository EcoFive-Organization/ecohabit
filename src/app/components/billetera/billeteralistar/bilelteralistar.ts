import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Billetera } from '../../../models/Billetera';
import { RouterLink } from '@angular/router';
import { Billeteraservice } from '../../../services/billeteraservice';

@Component({
  selector: 'app-bilelteralistar',
  imports: [MatTableModule,CommonModule,MatIconModule,MatButtonModule,RouterLink],
  templateUrl: './bilelteralistar.html',
  styleUrl: './bilelteralistar.css'
})
export class Bilelteralistar implements OnInit {
  dataSource: MatTableDataSource<Billetera> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5'];

  constructor(private bS: Billeteraservice) {}

  ngOnInit(): void {
    this.bS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    
  this.bS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id:number){
    this.bS.delete(id).subscribe(data=>{
      this.bS.list().subscribe(data=>{
        this.bS.setList(data)
      })
    })
  }
}
