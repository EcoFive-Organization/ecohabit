import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Transaccion } from '../../../models/Transaccion';
import { Transaccionservice } from '../../../services/transaccionservice';

@Component({
  selector: 'app-transaccionlistar',
  imports: [MatTableModule,CommonModule,MatIconModule,MatButtonModule,RouterLink],
  templateUrl: './transaccionlistar.html',
  styleUrl: './transaccionlistar.css',
})
export class Transaccionlistar implements OnInit{
  dataSource: MatTableDataSource<Transaccion> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6','c7'];

  constructor(private tS: Transaccionservice) {}

  ngOnInit(): void {
    this.tS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    
  this.tS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id:number){
    this.tS.delete(id).subscribe(data=>{
      this.tS.list().subscribe(data=>{
        this.tS.setList(data)
      })
    })
  }

}
