import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// 1. Importaciones de PayPal y Servicios
import { NgxPayPalModule, IPayPalConfig, ICreateSubscriptionRequest } from 'ngx-paypal';
import { PlanSuscripcion } from '../../../models/PlanSuscripcion';
import { Plansuscripcionservice } from '../../../services/plansuscripcionservice';
import { Suscripcionservice } from '../../../services/suscripcionservice';
import { Suscripcion } from '../../../models/Suscripcion';
import { Usuario } from '../../../models/Usuario';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-plansuscripcionlistar',
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    NgxPayPalModule, // Modulo de PayPal
  ],
  templateUrl: './plansuscripcionlistar.html',
  styleUrl: './plansuscripcionlistar.css',
})
export class Plansuscripcionlistar implements OnInit {
  listaPlanes: PlanSuscripcion[] = [];
  public payPalConfig?: IPayPalConfig;

  // Variable para controlar qué plan está seleccionando el usuario
  planSeleccionado: PlanSuscripcion | null = null;

  // Variable nueva para controlar el estado
  esPremium: boolean = false;

  idUsuarioLogueado: number = 0;

  constructor(
    private pS: Plansuscripcionservice,
    private sS: Suscripcionservice // Necesitamos este servicio para guardar la suscripción
  ) {}

  ngOnInit(): void {
    // Leer explícitamente el ID que guardó el Login
    const idStorage = sessionStorage.getItem('idUsuario');

    // LOG PARA DEPURAR
    console.log('Buscando ID en SessionStorage:', idStorage);

    if (idStorage) {
      this.idUsuarioLogueado = parseInt(idStorage);
      console.log('ID de Usuario cargado:', this.idUsuarioLogueado);

      // Solo verificamos si tenemos un ID válido
      this.verificarEstadoUsuario();
    } else {
      console.error("No se encontró 'idUsuario' en sessionStorage. ¿Hiciste Login?");
    }

    this.pS.list().subscribe((data) => {
      this.listaPlanes = data;
    });

    this.verificarEstadoUsuario();
  }

  verificarEstadoUsuario() {
    // Verificamos el estado del ID real cargado
    console.log(
      'Preguntando al backend si el usuario ' + this.idUsuarioLogueado + ' es Premium...'
    );

    this.sS.verificarSuscripcion(this.idUsuarioLogueado).subscribe((activo) => {
      this.esPremium = activo;
      console.log('RESPUESTA DEL BACKEND: Es premium? ->', this.esPremium);
    });
  }

  // Método que se ejecuta al dar clic en "Seleccionar"
  seleccionarPlan(plan: PlanSuscripcion) {
    // 1. Reseteamos todo primero para "matar" cualquier instancia vieja del botón
    this.planSeleccionado = null;
    this.payPalConfig = undefined;

    // 2. Usamos un pequeño timeout para dar tiempo a Angular de limpiar el DOM
    setTimeout(() => {
      // 3. Primero configuramos
      this.initConfig(plan);

      // 4. Y POR ÚLTIMO mostramos el componente (activamos el *ngIf)
      this.planSeleccionado = plan;
    }, 50); // 50 milisegundos es imperceptible para el ojo pero suficiente para Angular
  }

  // 3. Configuración de la API de PayPal
  private initConfig(plan: PlanSuscripcion): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: environment.paypalClientId, // Lo toma de tu environment

      // Esta función crea la suscripción en PayPal
      createSubscription: ((data: any, actions: any) => {
        return actions.subscription.create({
          plan_id: plan.paypalPlanId, // <--- Aquí va el ID P-.... de tu base de datos
        });
      }) as any,

      // Si el pago es aprobado por PayPal
      onApprove: ((data: any, actions: any) => {
        console.log('Transacción aprobada (Objeto):', data);

        // CORRECCIÓN: Usamos orderID como respaldo si subscriptionID no viene
        const idReferencia = data.subscriptionID || data.orderID || data.paymentID;

        console.log('ID QUE ENVIAREMOS AL BACKEND:', idReferencia); // Verifica que esto ya no sea undefined

        this.registrarSuscripcionEnBackend(plan, idReferencia);
      }) as any,

      onCancel: (data: any, actions: any) => {
        console.log('Transacción cancelada');
      },

      onError: (err: any) => {
        console.log('Error en PayPal:', err);
      },

      onClick: (data: any, actions: any) => {
        console.log('Botón presionado', data, actions);
      },
    };
  }

  // 4. Guardar en tu Base de Datos PostgreSQL
  registrarSuscripcionEnBackend(plan: PlanSuscripcion, paypalSubId: string) {
    if (!paypalSubId) {
      console.error('Error crítico: ID de PayPal vacío');
      return;
    }

    // Objeto Plano (Flat JSON) para coincidir con el nuevo DTO de Java
    const suscripcionDTO = {
      idSuscripcion: 0,
      fechaInicio: new Date(),
      fechaFin: this.calcularFechaFin(),
      estado: 'ACTIVA',
      paypalSuscripcionId: paypalSubId,

      // ENVIAMOS SOLO LOS IDs (enteros), YA NO OBJETOS {}
      idUsuario: this.idUsuarioLogueado, // Usamos la variable que capturamos del login
      idPlanSuscripcion: plan.idPlanSuscripcion,
    };

    console.log('ENVIANDO AL BACKEND:', JSON.stringify(suscripcionDTO));

    // Usamos 'as any' para que TypeScript no se queje de que no coincide con el modelo 'Suscripcion' antiguo
    this.sS.insert(suscripcionDTO as any).subscribe({
      next: () => {
        alert('¡Suscripción exitosa! Se ha registrado en el sistema.');
        this.planSeleccionado = null;
        this.esPremium = true;
      },
      error: (err) => {
        console.error('Error al guardar en BD:', err);
        alert('Error al guardar: ' + (err.error?.message || err.message));
      },
    });
  }

  // Función auxiliar simple para fecha fin
  private calcularFechaFin(): Date {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + 1);
    return fecha;
  }
}
