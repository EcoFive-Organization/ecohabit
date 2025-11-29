import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Consumoservice } from '../../../services/consumoservice';
import { CantidadConsumoDTO } from '../../../models/CantidadConsumoDTO';

@Component({
  selector: 'app-reporte-cantidad-tipo-consumo',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, BaseChartDirective],
  templateUrl: './reporte-cantidad-tipo-consumo.html',
  styleUrl: './reporte-cantidad-tipo-consumo.css',
})
export class ReporteCantidadTipoConsumo implements OnInit{
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Frecuencia de Registros por Tipo' }
    }
  };
  
  public pieChartType: ChartType = 'doughnut'; // 'pie' o 'doughnut' (dona se ve más moderno)

  public pieChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: [],
    datasets: [{ 
      data: [], 
      // Colores EcoHabit: Agua (Azul), Electricidad (Amarillo), Gas (Naranja), Otro (Verde)
      backgroundColor: ['#03A9F4', '#FFC107', '#FF9800', '#5FB963'],
      hoverBackgroundColor: ['#0288D1', '#FFB300', '#F57C00', '#388E3C'],
      borderWidth: 0
    }]
  };

  totalRegistros: number = 0;

  constructor(private cS: Consumoservice) {}
  ngOnInit(): void {
      this.cargarDatos();
  }
  cargarDatos() {
    this.cS.getCantidadPorTipoConsumo().subscribe({
      next: (data: CantidadConsumoDTO[]) => {
        // Mapeamos los datos para el gráfico
        this.pieChartData.labels = data.map(item => item.tipo);
        this.pieChartData.datasets[0].data = data.map(item => item.cantidad);
        
        // Calcular el total para mostrarlo en el centro o resumen
        this.totalRegistros = data.reduce((acc, item) => acc + item.cantidad, 0);

        // Actualizar gráfico
        this.pieChartData = { ...this.pieChartData };
      },
      error: (e) => console.error("Error al cargar reporte cantidad:", e)
    });
  }
}
