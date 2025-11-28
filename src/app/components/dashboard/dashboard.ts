import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Dispositivo } from '../../models/Dispositivo';
import { Loginservice } from '../../services/loginservice';
import { Dispositivoservice } from '../../services/dispositivoservice';

interface DeviceData {
  device: string;
  resource: string;
  consumption: number;
  unit: string;
  timestamp: Date;
}

interface ConsumptionSummary {
  id: string;
  title: string;
  value: number;
  unit: string;
  trend: string;
  trendValue: number;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  summaryData: ConsumptionSummary[] = [];
  deviceDataSource = new MatTableDataSource<DeviceData>();
  displayedColumns: string[] = ['device', 'resource', 'consumption', 'timestamp'];

  private userDevices: Dispositivo[] = [];
  private intervalId: any;
  private idUsuario: number = 0;

  // Variables para lógica de negocio
  private accumulatedTotals: { [key: string]: number } = { AGUA: 0, ELECTRICIDAD: 0, GAS: 0 };
  private previousTickTotals: { [key: string]: number } = { AGUA: 0, ELECTRICIDAD: 0, GAS: 0 };

  // 🟢 NUEVO: Lógica para Consejo del Día
  currentTip: string = '';
  ecoTips: string[] = [
    "Reducir el tiempo de tu ducha de 10 a 5 minutos puede ahorrar hasta 75 litros de agua por vez.",
    "Desconecta los aparatos electrónicos en 'stand-by' para evitar el consumo fantasma.",
    "Aprovecha la luz natural siempre que sea posible y apaga las luces al salir de una habitación.",
    "Lavar la ropa con agua fría ahorra cerca del 80% de la energía que usa la lavadora.",
    "Instalar aireadores en los grifos puede reducir el caudal de agua en un 50% sin perder presión."
  ];

  constructor(
    private loginService: Loginservice,
    private dispositivoService: Dispositivoservice
  ) {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decoded = this.loginService.decodeToken(token);
      this.idUsuario = decoded?.id || decoded?.sub || 0;
    }
  }

  ngOnInit(): void {
    this.initializeSummaryStructure();
    this.selectRandomTip(); // <-- Seleccionar consejo al iniciar

    if (this.idUsuario) {
      this.loadUserDevicesAndStartSimulation();
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // 🟢 NUEVO: Método para elegir un consejo aleatorio
  selectRandomTip(): void {
    const randomIndex = Math.floor(Math.random() * this.ecoTips.length);
    this.currentTip = this.ecoTips[randomIndex];
  }

  initializeSummaryStructure(): void {
    this.summaryData = [
      {
        id: 'agua',
        title: 'AGUA',
        value: 0,
        unit: 'L',
        trend: 'flat',
        trendValue: 0,
        color: '#03A9F4',
        icon: 'water_drop'
      },
      {
        id: 'electricidad',
        title: 'ELECTRICIDAD',
        value: 0,
        unit: 'W',
        trend: 'flat',
        trendValue: 0,
        color: '#FFC107',
        icon: 'bolt'
      },
      { 
        id: 'gas',
        title: 'GAS',
        value: 0,
        unit: 'm³',
        trend: 'flat',
        trendValue: 0,
        color: '#FF9800',
        icon: 'local_fire_department'
      },
    ];
  }

  loadUserDevicesAndStartSimulation(): void {
    this.dispositivoService.listByUserId(this.idUsuario).subscribe({
      next: (devices) => {
        this.userDevices = devices;
        if (devices.length === 0) {
          this.deviceDataSource.data = [];
          return;
        }
        this.updateDataSimulation();
        this.intervalId = setInterval(() => this.updateDataSimulation(), 5000);
      },
      error: (err) => console.error(err),
    });
  }

  updateDataSimulation(): void {
    if (this.userDevices.length === 0) return;

    const newDeviceData = this.userDevices.map((device) => {
      const tipoLower = (device.tipo || '').toLowerCase();
      let resourceType = 'Otro';
      let unit = 'ud';

      if (tipoLower.includes('agua')) { unit = 'L'; resourceType = 'Agua'; }
      else if (tipoLower.includes('electricidad') || tipoLower.includes('luz')) { unit = 'W'; resourceType = 'Electricidad'; }
      else if (tipoLower.includes('gas')) { unit = 'm³'; resourceType = 'Gas'; }

      return {
        device: device.nombre,
        resource: resourceType,
        consumption: parseFloat((Math.random() * 0.1 + 0.5).toFixed(2)),
        unit: unit,
        timestamp: new Date(),
      };
    });

    this.deviceDataSource.data = newDeviceData;
    this.updateSummaryValues(newDeviceData);
  }

  updateSummaryValues(data: DeviceData[]): void {
    const currentTickTotals: { [key: string]: number } = { AGUA: 0, ELECTRICIDAD: 0, GAS: 0 };

    // 1. Calcular totales del tick actual
    data.forEach((item) => {
      const key = item.resource.toUpperCase();
      if (currentTickTotals[key] !== undefined) {
        currentTickTotals[key] += item.consumption;
      }
    });

    // 2. Sumar al histórico
    Object.keys(currentTickTotals).forEach(key => {
      this.accumulatedTotals[key] += currentTickTotals[key];
    });

    // 3. Mapear datos y calcular tendencia
    this.summaryData = this.summaryData.map((item) => {
      const key = item.title;
      const currentVal = currentTickTotals[key] || 0;
      const previousVal = this.previousTickTotals[key] || 0;
      const totalAcumulado = this.accumulatedTotals[key];

      let trendDirection = 'flat';
      let trendPercentage = 0;

      // Si tenemos datos previos para comparar
      if (previousVal > 0) {
        const diff = currentVal - previousVal;
        trendPercentage = (Math.abs(diff) / previousVal) * 100;

        // 🟢 LÓGICA MODIFICADA: Comparación directa estricta
        // Si el actual es mayor al anterior -> ARRIBA
        if (currentVal > previousVal) {
          trendDirection = 'up';
        } 
        // Si el actual es menor al anterior -> ABAJO
        else if (currentVal < previousVal) {
          trendDirection = 'down';
        }
        
      } else if (currentVal > 0) {
        // Primera vez que entra data
        trendDirection = 'up';
        trendPercentage = 100;
      }

      return {
        ...item,
        value: parseFloat(totalAcumulado.toFixed(2)),
        trend: trendDirection,
        trendValue: parseFloat(trendPercentage.toFixed(1)),
      };
    });

    this.previousTickTotals = { ...currentTickTotals };
  }

  goToDetail(id: string): void {}
}