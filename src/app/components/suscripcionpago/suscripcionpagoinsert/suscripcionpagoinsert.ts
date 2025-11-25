import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Suscripcionpago } from '../../../models/SuscripcionPago';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Suscripcionpagoservices } from '../../../services/suscripcionpagoservices';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-suscripcionpagoinsert',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule],
  templateUrl: './suscripcionpagoinsert.html',
  styleUrl: './suscripcionpagoinsert.css',
})
export class Suscripcionpagoinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  susp: Suscripcionpago = new Suscripcionpago();
  edicion: boolean = false;
  id: number = 0;
  // Va a manejar varios softwares y los va a almacenar
  listaUsuarios: Usuario[] = []
  constructor(
    private spS: Suscripcionpagoservices,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: Usuarioservice
  ){}
  ngOnInit(): void {
      this.route.params.subscribe((data: Params)=>{
        this.id = data['id'];
        this.edicion = data['id'] != null;
      });

      this.uS.list().subscribe((data) => {
      this.listaUsuarios = data})

      this.uS.list().subscribe((data) => {
      this.listaUsuarios = data})

      this.form = this.formBuilder.group({
      id: [''],
      monto:['',Validators.required],
      fecha:[new Date(),Validators.required],
      estado:['',Validators.required],
      usuarioL: ['', Validators.required],
      saldo: ['', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]] // FK de Software
    });
  }
}
