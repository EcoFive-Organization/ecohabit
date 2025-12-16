import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Consumoservice } from '../../../services/consumoservice';
import { forkJoin } from 'rxjs'; // 🟢 Para peticiones paralelas
import * as XLSX from 'xlsx'; // 🟢 Librería Excel
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, BaseChartDirective, RouterLink],
  templateUrl: './historial.html',
  styleUrls: ['./historial.css']
})
export class HistorialComponent implements OnInit {
  
  hasData: boolean = true; // Controla si mostramos gráficos o mensaje de "vacío"

  // Estructura de datos para las tarjetas
  resumen = {
    agua: { total: 0, unidad: 'L', tendencia: 'flat', porcentaje: 0 },
    electricidad: { total: 0, unidad: 'W', tendencia: 'flat', porcentaje: 0 },
    gas: { total: 0, unidad: 'm³', tendencia: 'flat', porcentaje: 0 }
  };

  // Configuración del Gráfico
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'bottom' } },
    scales: { x: {}, y: { min: 0 } }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      { data: [], label: 'Agua (L)', backgroundColor: '#03A9F4', borderRadius: 5 },
      { data: [], label: 'Electricidad (W)', backgroundColor: '#FFEB3B', borderRadius: 5 },
      { data: [], label: 'Gas (m³)', backgroundColor: '#FF9800', borderRadius: 5 }
    ]
  };

  constructor(private cS: Consumoservice) {}

  ngOnInit(): void {
    this.cargarDatosComparativos();
  }

  cargarDatosComparativos() {
    // 🟢 Hacemos dos peticiones a la vez: Semana Actual (0) y Semana Pasada (1)
    forkJoin({
      actual: this.cS.getGraficoSemanal(0),
      anterior: this.cS.getGraficoSemanal(1)
    }).subscribe({
      next: (response) => {
        // 1. Validar si hay datos en la semana actual
        if (!response.actual || response.actual.length === 0) {
          this.hasData = false;
          return;
        }
        this.hasData = true;

        // 2. Procesar semana actual para pintar el gráfico
        const totalesActuales = this.procesarGrafico(response.actual);
        
        // 3. Procesar semana anterior solo para obtener totales comparativos
        const totalesAnteriores = this.calcularTotalesSimples(response.anterior);

        // 4. Calcular tendencias (Flechas y Porcentajes)
        this.calcularTendencia('agua', totalesActuales.agua, totalesAnteriores.agua);
        this.calcularTendencia('electricidad', totalesActuales.luz, totalesAnteriores.luz);
        this.calcularTendencia('gas', totalesActuales.gas, totalesAnteriores.gas);
      },
      error: (e) => {
        console.error('Error cargando historial:', e);
        this.hasData = false; // En caso de error, mostramos estado vacío
      }
    });
  }

  // Procesa datos para llenar el gráfico y devolver totales
  procesarGrafico(data: any[]) {
    const aguaData = [0,0,0,0,0,0,0];
    const luzData = [0,0,0,0,0,0,0];
    const gasData = [0,0,0,0,0,0,0];
    
    let totalAgua = 0, totalLuz = 0, totalGas = 0;

    data.forEach(item => {
      // Corrección de zona horaria manual
      const fechaStr = item.fecha.toString();
      const partes = fechaStr.split('-');
      const fecha = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
      
      let dia = fecha.getDay() - 1;
      if (dia === -1) dia = 6; // Ajuste Domingo

      const val = item.total;
      const tipo = (item.tipo || '').toLowerCase();

      if (tipo.includes('agua')) { aguaData[dia] += val; totalAgua += val; }
      else if (tipo.includes('electricidad') || tipo.includes('luz')) { luzData[dia] += val; totalLuz += val; }
      else if (tipo.includes('gas')) { gasData[dia] += val; totalGas += val; }
    });

    // Actualizar datos del chart
    this.barChartData.datasets[0].data = aguaData;
    this.barChartData.datasets[1].data = luzData;
    this.barChartData.datasets[2].data = gasData;
    this.barChartData = { ...this.barChartData }; // Refrescar vista

    return { agua: totalAgua, luz: totalLuz, gas: totalGas };
  }

  // Solo suma totales (sin lógica de días) para la semana pasada
  calcularTotalesSimples(data: any[]) {
    let tAgua = 0, tLuz = 0, tGas = 0;
    data.forEach(item => {
      const val = item.total;
      const tipo = (item.tipo || '').toLowerCase();
      if (tipo.includes('agua')) tAgua += val;
      else if (tipo.includes('electricidad') || tipo.includes('luz')) tLuz += val;
      else if (tipo.includes('gas')) tGas += val;
    });
    return { agua: tAgua, luz: tLuz, gas: tGas };
  }

  // Lógica de Tendencias (Comparación y Colores)
  calcularTendencia(recurso: 'agua' | 'electricidad' | 'gas', actual: number, anterior: number) {
    this.resumen[recurso].total = parseFloat(actual.toFixed(2));
    
    // Si no hubo consumo la semana pasada, es subida del 100% o plano
    if (anterior === 0) {
      this.resumen[recurso].porcentaje = 100;
      this.resumen[recurso].tendencia = actual > 0 ? 'up' : 'flat';
      return;
    }

    const diff = actual - anterior;
    const porcentaje = (Math.abs(diff) / anterior) * 100;
    
    this.resumen[recurso].porcentaje = parseFloat(porcentaje.toFixed(1));

    // LÓGICA ECOLÓGICA:
    // Si consumo MÁS que antes (diff > 0) -> Flecha ARRIBA (Malo/Rojo)
    // Si consumo MENOS que antes (diff < 0) -> Flecha ABAJO (Bueno/Verde)
    if (diff > 0.01) this.resumen[recurso].tendencia = 'up';
    else if (diff < -0.01) this.resumen[recurso].tendencia = 'down';
    else this.resumen[recurso].tendencia = 'flat';
  }

  descargarExcel() {
    const datosParaExcel: any[] = [];
    datosParaExcel.push(['Día', 'Agua (L)', 'Electricidad (W)', 'Gas (m³)']);

    const etiquetas = this.barChartData.labels;
    const dAgua = this.barChartData.datasets[0].data;
    const dLuz = this.barChartData.datasets[1].data;
    const dGas = this.barChartData.datasets[2].data;

    if (etiquetas) {
      for (let i = 0; i < etiquetas.length; i++) {
        datosParaExcel.push([
          etiquetas[i],
          dAgua[i] || 0,
          dLuz[i] || 0,
          dGas[i] || 0
        ]);
      }
    }
    
    datosParaExcel.push(['', '', '', '']);
    datosParaExcel.push(['TOTALES', this.resumen.agua.total, this.resumen.electricidad.total, this.resumen.gas.total]);

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(datosParaExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte Semanal');

    const fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `EcoHabit_Reporte_${fecha}.xlsx`);
  }
}