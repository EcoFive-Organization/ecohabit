import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Publicacionservice } from '../../services/publicacionservice';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { RouterOutlet } from '@angular/router';
import { Loginservice } from '../../services/loginservice';

@Component({
  selector: 'app-reporte-cantidad-reacciones-publicacion',
  imports: [BaseChartDirective, MatIconModule, RouterOutlet],
  templateUrl: './reporte-cantidad-reacciones-publicacion.html',
  styleUrl: './reporte-cantidad-reacciones-publicacion.css',
  providers: [provideCharts(withDefaultRegisterables())],
})
export class ReporteCantidadReaccionesPublicacion {
  hasData = false;
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  //Leyenda del gráfico
  barChartLegend = true;
  //Trae la Data
  barChartData: ChartDataset[] = [];
  //Define el tipo de gráfico
  barChartType: ChartType = 'doughnut';

  // PALETA DE COLORES ECOHABIT [cite: 556-597]
  // Definimos un array con suficientes colores para cubrir varias secciones
  private ecoColors = [
    '#5FB963', // Verde Principal
    '#03A9F4', // Azul Claro
    '#FFEB3B', // Amarillo
    '#FF9800', // Naranja
    '#F44336', // Rojo
    '#388E3C', // Verde Oscuro
    '#0288D1', // Azul Oscuro
    '#8BC34A', // Verde Lima (Complementario Eco)
    '#009688', // Teal (Complementario Eco)
    '#607D8B', // Gris Azulado (Complementario)
  ];

  constructor(private pS: Publicacionservice, private loginService: Loginservice) {}

  ngOnInit(): void {
    // 1. Obtener el ID del usuario logueado
    const idUsuario = this.loginService.getId();

    // Validar si existe el usuario antes de llamar
    if (idUsuario) {
      this.pS.getQuantity(idUsuario).subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.hasData = true;
            this.barChartLabels = data.map((item) => item.titulo);
            this.barChartData = [
              {
                data: data.map((item) => item.cantidadReacciones),
                label: 'Cantidad de Reacciones',
                backgroundColor: this.ecoColors,
                borderColor: '#FFFFFF',
                borderWidth: 2,
                hoverBackgroundColor: this.ecoColors,
                hoverBorderColor: '#FFFFFF',
                hoverBorderWidth: 3,
              },
            ];
          } else {
            this.hasData = false;
          }
        },
        error: (err) => {
          console.log('El usuario no tiene publicaciones o reacciones', err);
          this.hasData = false; // Si da 404 (Not Found), no mostramos gráfico
        },
      });
    }
  }
}
