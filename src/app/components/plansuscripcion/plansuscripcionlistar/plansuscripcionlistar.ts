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
    NgxPayPalModule, // <--- Importante: Agregar el módulo aquí
  ],
  templateUrl: './plansuscripcionlistar.html',
  styleUrl: './plansuscripcionlistar.css',
})
export class Plansuscripcionlistar implements OnInit {
  listaPlanes: PlanSuscripcion[] = [];
  public payPalConfig?: IPayPalConfig;

  // Variable para controlar qué plan está seleccionando el usuario
  planSeleccionado: PlanSuscripcion | null = null;

  constructor(
    private pS: Plansuscripcionservice,
    private sS: Suscripcionservice // Necesitamos este servicio para guardar la suscripción
  ) {}

  ngOnInit(): void {
    this.pS.list().subscribe((data) => {
      this.listaPlanes = data;
    });
  }

  // 2. Método que se ejecuta al dar clic en "Seleccionar"
  seleccionarPlan(plan: PlanSuscripcion) {
    this.planSeleccionado = plan;
    // Inicializamos la configuración de PayPal con el ID de este plan específico
    this.initConfig(plan);
  }

  // 3. Configuración de la API de PayPal
  private initConfig(plan: PlanSuscripcion): void {
    this.payPalConfig = {
      currency: 'USD', // O la moneda que hayas configurado en PayPal Sandbox
      clientId: environment.paypalClientId, // Lo toma de tu environment

      // Esta función crea la suscripción en PayPal
      createSubscription: ((data: any, actions: any) => {
        return actions.subscription.create({
          plan_id: plan.paypalPlanId, // <--- Aquí va el ID P-.... de tu base de datos
        });
      }) as any,

      // Si el pago es aprobado por PayPal
      onApprove: ((data: any, actions: any) => {
        console.log('Transacción aprobada:', data);

        // Aquí capturamos el ID de la suscripción generada por PayPal (I-...)
        const subscriptionId = data.subscriptionID;

        this.registrarSuscripcionEnBackend(plan, subscriptionId);
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
    const nuevaSuscripcion = new Suscripcion();

    // Datos del Plan
    nuevaSuscripcion.planSuscripcion = plan;

    // Datos del Usuario (Aquí deberías obtener el ID del usuario logueado)
    // Por ahora lo dejaremos hardcodeado o simula que lo sacas del localStorage
    nuevaSuscripcion.usuario = new Usuario();
    nuevaSuscripcion.usuario.idUsuario = 1; // <--- OJO: CAMBIAR POR ID REAL DEL USUARIO LOGUEADO

    // Datos de PayPal
    nuevaSuscripcion.paypalSuscripcionId = paypalSubId;
    nuevaSuscripcion.fechaInicio = new Date(); // Hoy

    // Calculamos fecha fin (1 mes después)
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 1);
    nuevaSuscripcion.fechaFin = fechaFin;

    nuevaSuscripcion.estado = 'ACTIVA';

    // Llamada al servicio
    this.sS.insert(nuevaSuscripcion).subscribe({
      next: () => {
        alert('¡Suscripción exitosa! Se ha registrado en el sistema.');
        this.planSeleccionado = null; // Limpiar selección
      },
      error: (err) => {
        console.error('Error al guardar en BD:', err);
        alert('El pago pasó en PayPal pero falló al guardar en el sistema.');
      },
    });
  }
}
