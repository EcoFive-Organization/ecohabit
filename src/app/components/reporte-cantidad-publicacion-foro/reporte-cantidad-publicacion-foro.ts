import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Foroservice } from '../../services/foroservice';

@Component({
  selector: 'app-reporte-cantidad-publicacion-foro',
  imports: [BaseChartDirective, MatIconModule, RouterOutlet],
  templateUrl: './reporte-cantidad-publicacion-foro.html',
  styleUrl: './reporte-cantidad-publicacion-foro.css',
  providers: [provideCharts(withDefaultRegisterables())]
})
export class ReporteCantidadPublicacionForo {
  hasData = false;
  barChartOptions: ChartOptions = {
    responsive: true
  }

  barChartLabels: string[] = []

  barChartLegend = true;

  barChartData: ChartDataset[] = []

  barChartType: ChartType = 'bar'

  constructor(private fs: Foroservice) { }
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fs.getQuantity().subscribe((data) => {
      if (data.length > 0) {
        this.hasData = true;
        this.barChartLabels = data.map((item) => item.nameForum)

        this.barChartData = [
          {
            data: data.map((item) => item.quantityPost),
            label: 'Cantidad de Publicaciones Según Foro',
            backgroundColor: [`rgba(133, 219, 83, 0.88)`, `rgba(204, 127, 97, 1)`],
          }
        ]
      }
      else {
        this.hasData = false;
      }
    })
  }

}
