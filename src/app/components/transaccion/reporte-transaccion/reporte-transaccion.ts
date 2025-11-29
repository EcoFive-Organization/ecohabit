import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CantidadTransaccionesDTO } from '../../../models/CantidadtRansaccionesDTO';
import { Transaccionservice } from '../../../services/transaccionservice';

@Component({
  selector: 'app-reporte-transaccion',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, BaseChartDirective],
  templateUrl: './reporte-transaccion.html',
  styleUrl: './reporte-transaccion.css',
})
export class ReporteTransaccion implements OnInit{
  // --- GRÁFICO: Monto Total por Tipo (Pie Chart) ---
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Distribución de Dinero por Tipo' }
    }
  };
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ 
      data: [], 
      backgroundColor: ['#5FB963', '#FF9800', '#03A9F4', '#FFC107'] // Colores EcoHabit
    }]
  };

  // --- TABLA: Detalles Completos ---
  dataSource = new MatTableDataSource<CantidadTransaccionesDTO>();
  displayedColumns: string[] = ['tipo', 'cantidad', 'usuarios', 'monto'];

  constructor(private tS: Transaccionservice) {}
  ngOnInit(): void {
    this.cargarReporteMontos();
    this.cargarReporteDetalles();
  }
  cargarReporteMontos() {
    this.tS.getMontoTransacciones().subscribe(data => {
      this.pieChartData.labels = data.map(x => x.tipo);
      this.pieChartData.datasets[0].data = data.map(x => x.totalmonto);
      
      // Forzar actualización visual
      this.pieChartData = { ...this.pieChartData };
    });
  }

  cargarReporteDetalles() {
    this.tS.getDetallesTransaccionesPorTipo().subscribe(data => {
      this.dataSource.data = data;
    });
  }
}
