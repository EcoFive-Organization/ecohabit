import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Chart } from 'chart.js/auto'; // Necesario para registrar controladores
import { Consumoservice } from '../../../services/consumoservice';
import { BaseChartDirective } from 'ng2-charts';

// 🟢 IMPORTAR LIBRERÍA DE EXCEL
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, BaseChartDirective],
  templateUrl: './historial.html',
  styleUrls: ['./historial.css']
})
export class HistorialComponent implements OnInit {
  
  // Datos para las tarjetas resumen
  resumen = {
    agua: { total: 0, unidad: 'L', tendencia: 'down' },
    electricidad: { total: 0, unidad: 'W', tendencia: 'up' },
    gas: { total: 0, unidad: 'm³', tendencia: 'down' }
  };

  // Configuración del Gráfico de Barras
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' }
    },
    scales: {
      x: {},
      y: { min: 0 }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      { data: [0, 0, 0, 0, 0, 0, 0], label: 'Agua (L)', backgroundColor: '#03A9F4', borderRadius: 5 },
      { data: [0, 0, 0, 0, 0, 0, 0], label: 'Electricidad (W)', backgroundColor: '#FFEB3B', borderRadius: 5 },
      { data: [0, 0, 0, 0, 0, 0, 0], label: 'Gas (m³)', backgroundColor: '#FF9800', borderRadius: 5 }
    ]
  };

  constructor(private consumoService: Consumoservice) {}

  ngOnInit(): void {
    this.cargarDatosGrafico();
  }

  cargarDatosGrafico() {
    this.consumoService.getGraficoSemanal().subscribe(data => {
      this.procesarDatos(data);
    });
  }

  procesarDatos(data: any[]) {
    // Reiniciar datos
    const aguaData = [0, 0, 0, 0, 0, 0, 0];
    const luzData = [0, 0, 0, 0, 0, 0, 0];
    const gasData = [0, 0, 0, 0, 0, 0, 0];

    let totalAgua = 0;
    let totalLuz = 0;
    let totalGas = 0;

    data.forEach(registro => {
      // Corrección de zona horaria para la fecha
      const fechaStr = registro.fecha.toString();
      const partes = fechaStr.split('-');
      const fecha = new Date(
        parseInt(partes[0]), 
        parseInt(partes[1]) - 1, 
        parseInt(partes[2])
      );

      // getDay() devuelve 0 para Domingo, 1 Lunes... lo ajustamos para que 0 sea Lunes
      let diaIndex = fecha.getDay() - 1; 
      if (diaIndex === -1) diaIndex = 6; // Domingo

      const valor = registro.total;
      const tipo = (registro.tipo || '').toLowerCase();

      if (tipo.includes('agua')) {
        aguaData[diaIndex] += valor;
        totalAgua += valor;
      } else if (tipo.includes('electricidad') || tipo.includes('luz')) {
        luzData[diaIndex] += valor;
        totalLuz += valor;
      } else if (tipo.includes('gas')) {
        gasData[diaIndex] += valor;
        totalGas += valor;
      }
    });

    // Actualizar Gráfico
    this.barChartData.datasets[0].data = aguaData;
    this.barChartData.datasets[1].data = luzData;
    this.barChartData.datasets[2].data = gasData;
    
    // Forzar actualización del gráfico
    this.barChartData = { ...this.barChartData };

    // Actualizar Tarjetas
    this.resumen.agua.total = parseFloat(totalAgua.toFixed(2));
    this.resumen.electricidad.total = parseFloat(totalLuz.toFixed(2));
    this.resumen.gas.total = parseFloat(totalGas.toFixed(2));
  }

  // 🟢 MÉTODO PARA EXPORTAR A EXCEL
  descargarExcel() {
    // 1. Preparar datos
    const datosParaExcel: any[] = [];
    datosParaExcel.push(['Día', 'Agua (L)', 'Electricidad (W)', 'Gas (m³)']); // Encabezados

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

    // Fila de totales
    datosParaExcel.push(['', '', '', '']); // Espacio vacío
    datosParaExcel.push([
      'TOTALES', 
      this.resumen.agua.total, 
      this.resumen.electricidad.total, 
      this.resumen.gas.total
    ]);

    // 2. Crear hoja y libro
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(datosParaExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historial Semanal');

    // 3. Guardar archivo
    const fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `EcoHabit_Reporte_${fecha}.xlsx`);
  }
}