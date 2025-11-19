import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Transaccion } from '../../../models/Transaccion';
import { Billetera } from '../../../models/Billetera';
import { Transaccionservice } from '../../../services/transaccionservice';
import { Billeteraservice } from '../../../services/billeteraservice';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-transaccioninsert',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule, MatSliderModule],
  templateUrl: './transaccioninsert.html',
  styleUrl: './transaccioninsert.css',
})
export class Transaccioninsert implements OnInit {
  form: FormGroup = new FormGroup({});
  tra: Transaccion = new Transaccion();
  edicion: boolean = false;

  id: number = 0;
  today = new Date();
  tipos: { value: string; viewValue: string }[] = [
    { value: 'Yape', viewValue: 'Yape' },
    { value: 'Plin', viewValue: 'Plin' },
    { value: 'Tarjeta de Credito', viewValue: 'Tarjeta de Credito' },
    { value: 'Tarjeta de Debito', viewValue: 'Tarjeta de Debito' },
    { value: 'Transferencia', viewValue: 'Transferencia' },
    { value: 'PayPal', viewValue: 'PayPal' },
  ];

  // Va a manejar varios softwares y los va a almacenar
  listaBilletras: Billetera[] = [];

  constructor(
    private tS: Transaccionservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private bS: Billeteraservice // llamar al Software Service para usar el metodo listar en el selector de registro de licencia
  ) {}

  // Esto se ejecuta ni bien inicia el
  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    // Ni bien inicia el componente la listaSoftwares se llena
    this.bS.list().subscribe((data) => {
      this.listaBilletras = data;
    });

    this.form = this.formBuilder.group({
      id: [''],
      billeteraL: ['', Validators.required], // FK de Billetera
      tipo: ['', Validators.required],
      monto: ['', Validators.required],
      fecha: [new Date(), Validators.required], // Fecha actual por defecto
    });
  }

  // para el slider
  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  aceptar(): void {
    if (this.form.valid) {
      this.tra.idTransaccion = this.form.value.id;

      // --- CORRECCION ---
      this.tra.billetera = new Billetera();
      this.tra.billetera.idBilletera = this.form.value.billeteraL;
      // --- FIN DE LA CORRECCIÓN ---

      this.tra.tipo = this.form.value.tipo;
      this.tra.monto = this.form.value.monto;
      this.tra.fecha = this.form.value.fecha;

      if (this.edicion) {
        // Llama a tu servicio de actualización
        this.tS.update(this.tra).subscribe(() => {
          this.tS.list().subscribe((data) => {
            this.tS.setList(data);
          });
        });
      } else {
        // Llama a tu servicio de inserción
        this.tS.insert(this.tra).subscribe(() => {
          this.tS.list().subscribe((data) => {
            this.tS.setList(data);
          });
        });
      }
      this.router.navigate(['listartransacciones']);
    }
  }
  // Al momento de actualizar algún registro trae toda la data en los campos, la FK
  init() {
    if (this.edicion) {
      this.tS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          id: new FormControl(data.idTransaccion),
          billeteraL: new FormControl(data.billetera.idBilletera),
          tipo: new FormControl(data.tipo),
          monto: new FormControl(Number(data.monto ?? 0)), // para el slider
          fecha: new FormControl(data.fecha)
        });
      });
    }
  }
}
