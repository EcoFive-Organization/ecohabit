import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MetodoPago } from '../../../models/MetodoPago';
import { Metodopagoservice } from '../../../services/metodopagoservice';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-metodopagoinsert',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './metodopagoinsert.html',
  styleUrl: './metodopagoinsert.css',
})
export class Metodopagoinsert implements OnInit {
  form: FormGroup = new FormGroup({})
  metodoPago: MetodoPago = new MetodoPago();

  id: number = 0

  constructor(
    private mpS: Metodopagoservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
        this.id = data[`id`]
    })
    
    this.form = this.formBuilder.group({
      tipo: ['', Validators.required],
      detalles: ['', [Validators.required, Validators.maxLength(255)]],
      fechaRegistro: [new Date(), Validators.required],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.metodoPago.tipo = this.form.value.tipo;
      this.metodoPago.detalles = this.form.value.detalles;
      this.metodoPago.fechaRegistro = this.form.value.fechaRegistro;

      this.mpS.insert(this.metodoPago).subscribe((data) => {
        this.mpS.list().subscribe((data) => {
          this.mpS.setList(data)
        })
      })
      this.router.navigate(['menu/listarmetodopago'])
    }
  }
}
