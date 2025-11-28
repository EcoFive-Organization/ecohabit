import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Dispositivo } from '../../models/Dispositivo';
import { Loginservice } from '../../services/loginservice';
import { Dispositivoservice } from '../../services/dispositivoservice';

// 🟢 IMPORTACIONES PARA GUARDAR EN BD
import { Consumoservice } from '../../services/consumoservice';
import { Consumo } from '../../models/Consumo';

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

  // Variables para lógica de negocio (Totales acumulados)
  private accumulatedTotals: { [key: string]: number } = { AGUA: 0, ELECTRICIDAD: 0, GAS: 0 };
  private previousTickTotals: { [key: string]: number } = { AGUA: 0, ELECTRICIDAD: 0, GAS: 0 };

  // 🟢 OPTIMIZACIÓN BD: Contadores para guardar cada 30s
  private saveCounter: number = 0;
  private readonly TICKS_TO_SAVE: number = 6; // 5 segundos * 6 = 30 segundos

  // Lógica para Consejo del Día
  currentTip: string = '';
  ecoTips: string[] = [
    'Reducir el tiempo de tu ducha de 10 a 5 minutos puede ahorrar hasta 75 litros de agua por vez.',
    "Desconecta los aparatos electrónicos en 'stand-by' para evitar el consumo fantasma.",
    'Aprovecha la luz natural siempre que sea posible y apaga las luces al salir de una habitación.',
    'Lavar la ropa con agua fría ahorra cerca del 80% de la energía que usa la lavadora.',
    'Instalar aireadores en los grifos puede reducir el caudal de agua en un 50% sin perder presión.',
  ];

  constructor(
    private loginService: Loginservice,
    private dispositivoService: Dispositivoservice,
    private consumoService: Consumoservice, // Inyección del servicio
    private router: Router
  ) {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decoded = this.loginService.decodeToken(token);
      this.idUsuario = decoded?.id || decoded?.sub || 0;
    }
  }

  ngOnInit(): void {
    this.initializeSummaryStructure();

    // 🟢 RECUPERAR DATOS DE LOCALSTORAGE (Persistencia entre sesiones)
    if (this.idUsuario) {
      const storageKey = `dashboard_totals_${this.idUsuario}`;
      const savedTotals = localStorage.getItem(storageKey);

      if (savedTotals) {
        this.accumulatedTotals = JSON.parse(savedTotals);
        // Actualizamos las tarjetas visualmente antes de empezar la simulación
        this.refreshCardsWithStoredValues();
      }

      this.loadUserDevicesAndStartSimulation();
    }

    this.selectRandomTip();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Método auxiliar para pintar los números guardados al inicio
  refreshCardsWithStoredValues(): void {
    this.summaryData = this.summaryData.map((item) => {
      const totalAcumulado = this.accumulatedTotals[item.title] || 0;
      return {
        ...item,
        value: parseFloat(totalAcumulado.toFixed(2)),
      };
    });
  }

  selectRandomTip(): void {
    const randomIndex = Math.floor(Math.random() * this.ecoTips.length);
    this.currentTip = this.ecoTips[randomIndex];
  }

  initializeSummaryStructure(): void {
    // Colores basados en Style Guidelines EcoHabit
    this.summaryData = [
      {
        id: 'agua',
        title: 'AGUA',
        value: 0,
        unit: 'L',
        trend: 'flat',
        trendValue: 0,
        color: '#03A9F4',
        icon: 'water_drop',
      },
      {
        id: 'electricidad',
        title: 'ELECTRICIDAD',
        value: 0,
        unit: 'W',
        trend: 'flat',
        trendValue: 0,
        color: '#FFC107',
        icon: 'bolt',
      },
      {
        id: 'gas',
        title: 'GAS',
        value: 0,
        unit: 'm³',
        trend: 'flat',
        trendValue: 0,
        color: '#FF9800',
        icon: 'local_fire_department',
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

        // Ejecución inmediata
        this.updateDataSimulation();

        // Intervalo visual de 5 segundos (Fluido para el usuario)
        this.intervalId = setInterval(() => this.updateDataSimulation(), 5000);
      },
      error: (err) => console.error(err),
    });
  }

  updateDataSimulation(): void {
    if (this.userDevices.length === 0) return;

    // 1. Control de Guardado en BD (Incrementamos contador)
    this.saveCounter++;
    const shouldSaveToDb = this.saveCounter >= this.TICKS_TO_SAVE;

    const newDeviceData = this.userDevices.map((device) => {
      const tipoLower = (device.tipo || '').toLowerCase();
      let resourceType = 'Otro';
      let unit = 'ud';

      if (tipoLower.includes('agua')) {
        unit = 'L';
        resourceType = 'Agua';
      } else if (tipoLower.includes('electricidad') || tipoLower.includes('luz')) {
        unit = 'W';
        resourceType = 'Electricidad';
      } else if (tipoLower.includes('gas')) {
        unit = 'm³';
        resourceType = 'Gas';
      }

      // Generar valor aleatorio
      const valorGenerado = parseFloat((Math.random() * 0.1 + 0.5).toFixed(2));

      // 🟢 2. GUARDAR EN BD (Solo si pasaron 30s)
      if (shouldSaveToDb) {
        let consumoAGuardar = new Consumo();
        consumoAGuardar.dispositivo = device;
        consumoAGuardar.tipo = device.tipo;
        consumoAGuardar.valor = valorGenerado;
        consumoAGuardar.unidad = unit;
        consumoAGuardar.origenConsumo = 'Simulación Dashboard';
        consumoAGuardar.fecha = new Date();
        consumoAGuardar.umbral = 1;

        // Llamada asíncrona
        this.consumoService.insert(consumoAGuardar).subscribe({
          next: () => console.log(`💾 Guardado (30s): ${device.nombre} - ${valorGenerado}`),
          error: (e) => console.error('Error guardando consumo', e),
        });
      }

      // Retornamos el objeto visual (se actualiza cada 5s)
      return {
        device: device.nombre,
        resource: resourceType,
        consumption: valorGenerado,
        unit: unit,
        timestamp: new Date(),
      };
    });

    // Reiniciamos contador si ya guardamos
    if (shouldSaveToDb) {
      this.saveCounter = 0;
    }

    // Actualizamos la tabla y las tarjetas visuales
    this.deviceDataSource.data = newDeviceData;
    this.updateSummaryValues(newDeviceData);
  }

  updateSummaryValues(data: DeviceData[]): void {
    const currentTickTotals: { [key: string]: number } = { AGUA: 0, ELECTRICIDAD: 0, GAS: 0 };

    data.forEach((item) => {
      const key = item.resource.toUpperCase();
      if (currentTickTotals[key] !== undefined) {
        currentTickTotals[key] += item.consumption;
      }
    });

    // ACUMULACIÓN: Se suma a lo que ya tenías
    Object.keys(currentTickTotals).forEach((key) => {
      this.accumulatedTotals[key] += currentTickTotals[key];
    });

    // 🟢 GUARDAR EN LOCALSTORAGE CADA VEZ QUE CAMBIA
    if (this.idUsuario) {
      const storageKey = `dashboard_totals_${this.idUsuario}`;
      localStorage.setItem(storageKey, JSON.stringify(this.accumulatedTotals));
    }

    this.summaryData = this.summaryData.map((item) => {
      const key = item.title;
      const currentVal = currentTickTotals[key] || 0;
      const previousVal = this.previousTickTotals[key] || 0;
      const totalAcumulado = this.accumulatedTotals[key];

      let trendDirection = 'flat';
      let trendPercentage = 0;

      if (previousVal > 0) {
        const diff = currentVal - previousVal;
        trendPercentage = (Math.abs(diff) / previousVal) * 100;

        // Lógica Ecológica:
        // Mayor consumo que antes -> ARRIBA (Malo/Rojo)
        if (currentVal > previousVal) {
          trendDirection = 'up';
        }
        // Menor consumo que antes -> ABAJO (Bueno/Verde)
        else if (currentVal < previousVal) {
          trendDirection = 'down';
        }
      } else if (currentVal > 0) {
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

  goToDetail(id: string): void {
    this.router.navigate(['/menu/listarconsumo/historial']);
  }
}
