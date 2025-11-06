import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Foro } from '../../../models/Foro';
import { Foroservice } from '../../../services/foroservice';

@Component({
  selector: 'app-forolistar',
  imports: [MatTableModule],
  templateUrl: './forolistar.html',
  styleUrl: './forolistar.css',
})
export class Forolistar implements OnInit{
  dataSource: MatTableDataSource<Foro>= new MatTableDataSource()
  displayedColumns: string[]=['c1','c2','c3']

  constructor(private fF: Foroservice){}

  ngOnInit(): void {
      this.fF.list().subscribe(data=> {
        this.dataSource = new MatTableDataSource(data)
      })
  }
  
}
