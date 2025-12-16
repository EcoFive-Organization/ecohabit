import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Consumoservice } from '../../../services/consumoservice';
import { CantConsumoDispDTO } from '../../../models/CantConsumoDispDTO';

@Component({
  selector: 'app-reporte-consumo-dispositivo',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, BaseChartDirective],
  templateUrl: './reporte-consumo-dispositivo.html',
  styleUrls: ['./reporte-consumo-dispositivo.css']
})
export class ReporteConsumoDispositivoComponent implements OnInit {

  // Configuración del Gráfico de Barras Verticales
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Ocultamos leyenda porque las barras ya tienen etiqueta en el eje X
      title: { display: true, text: 'Consumo Total Acumulado por Dispositivo' }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Consumo Total' }
      }
    }
  };
  
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ 
      data: [], 
      label: 'Consumo',
      backgroundColor: '#5FB963', // Verde Principal EcoHabit
      hoverBackgroundColor: '#388E3C', // Verde Oscuro al pasar el mouse
      borderRadius: 5
    }]
  };

  topDispositivo: string = '-';
  maxConsumo: number = 0;

  constructor(private cS: Consumoservice) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cS.getConsumoTotalPorDispositivo().subscribe({
      next: (data: CantConsumoDispDTO[]) => {
        // Ordenar datos de mayor a menor para que el gráfico se vea ordenado
        data.sort((a, b) => b.totalConsumo - a.totalConsumo);

        // Mapear datos
        this.barChartData.labels = data.map(item => item.nombreDispositivo);
        this.barChartData.datasets[0].data = data.map(item => item.totalConsumo);
        
        // Identificar el dispositivo con mayor consumo para mostrarlo destacado
        if (data.length > 0) {
          this.topDispositivo = data[0].nombreDispositivo;
          this.maxConsumo = data[0].totalConsumo;
        }

        // Actualizar gráfico
        this.barChartData = { ...this.barChartData };
      },
      error: (e) => console.error("Error al cargar reporte dispositivos:", e)
    });
  }
}