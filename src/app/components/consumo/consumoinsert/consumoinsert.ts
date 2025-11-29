import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Consumo } from '../../../models/Consumo';
import { Dispositivo } from '../../../models/Dispositivo';
import { Consumoservice } from '../../../services/consumoservice';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Dispositivoservice } from '../../../services/dispositivoservice';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-consumoinsert',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatNativeDateModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './consumoinsert.html',
  styleUrl: './consumoinsert.css',
})
export class Consumoinsert implements OnInit {
  form: FormGroup = new FormGroup({})
  consumo: Consumo = new Consumo();

  id: number = 0
  today = new Date();

  unidades: { value: string; viewValue: string }[] = [
    { value: 'kWh', viewValue: 'kWh' }, // Electricidad - Medidor inteligente, enchufe smart
    { value: 'L / m³', viewValue: 'L / m³' }, // Agua - 	Medidor de agua IoT, grifo inteligente
    { value: 'm³ / kg', viewValue: 'm³ / kg' } // Gas - 	Medidor de gas conectado
  ];

  listaDispositivos: Dispositivo[] = []

  constructor(
    private cS: Consumoservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private dS: Dispositivoservice
  ) {}


  ngOnInit(): void {
      this.route.params.subscribe((data: Params) => {
        this.id = data['id'];
      })

      this.dS.list().subscribe((data) => {
        this.listaDispositivos = data;
      })
    
    const soloLetras = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;

      this.form = this.formBuilder.group({
        id: [''],
        dispositivoL: ['', Validators.required],

        // Validación: Solo texto para el Tipo
        tipo: ['', [Validators.required, Validators.pattern(soloLetras)]],

        // Validación: Números positivos (mínimo 0.1 para aceptar decimales pequeños)
        valor: ['', [Validators.required, Validators.min(0.1)]],

        unidad: ['', Validators.required],

        // Validación: Solo texto para el Origen (ej. "Cocina", "Grifo Principal")
        origenConsumo: ['', [Validators.required, Validators.pattern(soloLetras)]],

        fecha: [new Date(), Validators.required],

        // Validación: Números positivos
        umbral: ['', [Validators.required, Validators.min(0.1)]],
      });
  }

  aceptar(): void {
    if (this.form.valid) {

      this.consumo.dispositivo = new Dispositivo();

      this.consumo.idConsumo = this.form.value.id;
      this.consumo.dispositivo.idDispositivo = this.form.value.dispositivoL;
      this.consumo.tipo = this.form.value.tipo;
      this.consumo.valor = this.form.value.valor;
      this.consumo.unidad = this.form.value.unidad;
      this.consumo.origenConsumo = this.form.value.origenConsumo;
      this.consumo.fecha = this.form.value.fecha;
      this.consumo.umbral = this.form.value.umbral;

      this.cS.insert(this.consumo).subscribe(data => {
        this.cS.list().subscribe((data) => {
          this.cS.setList(data);
        })
      })

      this.router.navigate(['menu/listarconsumo']);

    }
  }

}
