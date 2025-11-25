import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Suscripcion } from '../../../models/Suscripcion';
import { Usuario } from '../../../models/Usuario';
import { PlanSuscripcion } from '../../../models/PlanSuscripcion';
import { Suscripcionservice } from '../../../services/suscripcionservice';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Plansuscripcionservice } from '../../../services/plansuscripcionservice';

@Component({
  selector: 'app-suscripcioninsert',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './suscripcioninsert.html',
  styleUrl: './suscripcioninsert.css',
})
export class Suscripcioninsert implements OnInit {
  form: FormGroup = new FormGroup({});
  suscripcion: Suscripcion = new Suscripcion();

  id: number = 0;
  today = new Date();

  estados: { value: string; viewValue: string }[] = [
    { value: 'Inactiva', viewValue: 'Inactiva' },
    { value: 'Activa', viewValue: 'Activa' },
  ];

  listaUsuarios: Usuario[] = [];

  listaPlanes: PlanSuscripcion[] = [];

  constructor(
    private sS: Suscripcionservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: Usuarioservice,
    private pS: Plansuscripcionservice
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
    });

    this.uS.list().subscribe((data) => {
      this.listaUsuarios = data;
    });

    this.pS.list().subscribe((data) => {
      this.listaPlanes = data;
    });

    const fechaFinInicial = this.calcularFechaFin(this.today)

    this.form = this.formBuilder.group({
      id: [''],
      usuarioL: ['', Validators.required],
      planSuscripcionL: ['', Validators.required],
      fechaInicio: [new Date(), Validators.required],
      fechaFin: [fechaFinInicial, Validators.required],
      estado: ['', Validators.required],
    });

    // 2. LÓGICA REACTIVA: Detectar cambios en fechaInicio
    // Cada vez que el usuario cambie la fecha de inicio, recalculamos la fecha fin
    this.form.get('fechaInicio')?.valueChanges.subscribe((fechaSeleccionada: Date) => {
      if (fechaSeleccionada) {
        const nuevaFechaFin = this.calcularFechaFin(fechaSeleccionada);
        // PatchValue actualiza solo el campo específico
        this.form.patchValue({
          fechaFin: nuevaFechaFin,
        });
      }
    });
  }

  // --- FUNCIÓN AUXILIAR PARA SUMAR 1 MES ---
  calcularFechaFin(fecha: Date): Date {
    // Creamos una copia de la fecha para no modificar la original por referencia
    const resultado = new Date(fecha);
    // Sumamos exactamente 1 mes
    resultado.setMonth(resultado.getMonth() + 1);
    return resultado;
  }

  aceptar(): void {
    if (this.form.valid) {
      this.suscripcion.usuario = new Usuario();
      this.suscripcion.planSuscripcion = new PlanSuscripcion();

      this.suscripcion.idSuscripcion = this.form.value.id;
      this.suscripcion.usuario.idUsuario = this.form.value.usuarioL;
      this.suscripcion.planSuscripcion.idPlanSuscripcion = this.form.value.planSuscripcionL;
      this.suscripcion.fechaInicio = this.form.value.fechaInicio;
      this.suscripcion.fechaFin = this.form.value.fechaFin;
      this.suscripcion.estado = this.form.value.estado;

      this.sS.insert(this.suscripcion).subscribe((data) => {
        this.sS.list().subscribe((data) => {
          this.sS.setList(data);
        });
      });

      this.router.navigate(['menu/listarsuscripcion']);
    }
  }
}
