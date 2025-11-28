import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Usuarioservice } from '../../../services/usuarioservice';

@Component({
  selector: 'app-reporte-usuarios',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, BaseChartDirective],
  templateUrl: './reporte-usuarios.html',
  styleUrls: ['./reporte-usuarios.css']
})
export class ReporteUsuariosComponent implements OnInit {

  // --- GRÁFICO 1: USUARIOS POR ROL (PIE CHART) ---
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Distribución de Usuarios por Rol' }
    }
  };
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#5FB963', '#03A9F4', '#FF9800'] }] // Colores EcoHabit
  };

  // --- GRÁFICO 2: ESTADO POR ROL (BAR CHART) ---
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Distribución de Usuarios por Rol y Estado' }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } } // Eje Y enteros
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Activos', backgroundColor: '#5FB963' }, // Verde
      { data: [], label: 'Inactivos', backgroundColor: '#F44336' } // Rojo
    ]
  };

  constructor(private uS: Usuarioservice) {}

  ngOnInit(): void {
    this.cargarReporteRoles();
    this.cargarReporteEstados();
  }

  cargarReporteRoles() {
    this.uS.getUsuariosPorRol().subscribe(data => {
      // Extraemos etiquetas (Roles) y datos (Cantidades)
      this.pieChartData.labels = data.map(x => x.nombreRol);
      this.pieChartData.datasets[0].data = data.map(x => x.totalUsuarios);
      
      // Forzar actualización
      this.pieChartData = { ...this.pieChartData };
    });
  }

  cargarReporteEstados() {
    this.uS.getUsuariosPorEstadoRol().subscribe(data => {
      // 1. Obtener lista única de roles para el eje X
      const rolesUnicos = [...new Set(data.map(item => item.nombreRol))];
      this.barChartData.labels = rolesUnicos;

      // 2. Inicializar arrays de datos con 0
      const activosData = new Array(rolesUnicos.length).fill(0);
      const inactivosData = new Array(rolesUnicos.length).fill(0);

      // 3. Llenar los arrays según el rol y el estado
      data.forEach(item => {
        const index = rolesUnicos.indexOf(item.nombreRol);
        if (index !== -1) {
          if (item.enabled) {
            activosData[index] = item.totalUsuarios;
          } else {
            inactivosData[index] = item.totalUsuarios;
          }
        }
      });

      // 4. Asignar al gráfico
      this.barChartData.datasets[0].data = activosData;
      this.barChartData.datasets[1].data = inactivosData;

      // Forzar actualización
      this.barChartData = { ...this.barChartData };
    });
  }
}