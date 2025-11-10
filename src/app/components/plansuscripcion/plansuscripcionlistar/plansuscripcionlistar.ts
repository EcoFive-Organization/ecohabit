import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PlanSuscripcion } from '../../../models/PlanSuscripcion';
import { Plansuscripcionservice } from '../../../services/plansuscripcionservice';

@Component({
  selector: 'app-plansuscripcionlistar',
  imports: [MatTableModule],
  templateUrl: './plansuscripcionlistar.html',
  styleUrl: './plansuscripcionlistar.css',
})
export class Plansuscripcionlistar implements OnInit{
  dataSource:MatTableDataSource<PlanSuscripcion>=new MatTableDataSource()
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];
  constructor(private pS:Plansuscripcionservice){}
  ngOnInit(): void {
    this.pS.list().subscribe(data=>{
    this.dataSource=new MatTableDataSource(data)}
  )}
}
