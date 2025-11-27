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
import { Suscripcion } from '../../../models/Suscripcion';
import { MetodoPago } from '../../../models/MetodoPago';
import { Suscripcionservice } from '../../../services/suscripcionservice';
import { Metodopagoservice } from '../../../services/metodopagoservice';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-suscripcionpagoinsert',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
  MatDatepickerModule],
  templateUrl: './suscripcionpagoinsert.html',
  styleUrl: './suscripcionpagoinsert.css',
})
export class Suscripcionpagoinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  susp: Suscripcionpago = new Suscripcionpago();
  edicion: boolean = false;
  id: number = 0;
  today = new Date()
  // Va a manejar varios softwares y los va a almacenar
  listasuscripciones: Suscripcion[] = []
  listametodopago: MetodoPago[] = []
  constructor(
    private spS: Suscripcionpagoservices,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private sS: Suscripcionservice,
    private mpS: Metodopagoservice
  ){}
  ngOnInit(): void {
      this.route.params.subscribe((data: Params)=>{
        this.id = data['id'];
        this.edicion = data['id'] != null;
      });

      this.sS.list().subscribe((data) => {
      this.listasuscripciones = data})

      this.mpS.list().subscribe((data) => {
      this.listametodopago = data})

      this.form = this.formBuilder.group({
      id: [''],
      monto:['',[Validators.required,Validators.min(1), Validators.pattern(/^[0-9]+$/)]],
      fecha:[new Date(),Validators.required],
      estado:['',Validators.required,Validators.min(1),Validators.max(20)],
      referenciaexterna:['',Validators.required,Validators.min(1),Validators.max(100)],
      suscripcionL: ['', Validators.required],
      metodopagoL:['',Validators.required]
    });
  }
  aceptar(): void {
      if (this.form.valid) {
        this.susp.idSuscripcionPago = this.form.value.id;
        this.susp.monto = this.form.value.monto;
        this.susp.fecha = this.form.value.fecha;
        this.susp.estado = this.form.value.estado;
        this.susp.referenciaExterna = this.form.value.referenciaexterna;

        // 1. Asegúrate de que el objeto 'usuario' dentro de 'billetera' exista.
        // (Si tu clase Billetera no lo inicializa en el constructor, hazlo aquí)
        if (!this.susp.suscripcion) {
            this.susp.suscripcion = new Suscripcion();
        }
  
        // 2. Asigna el ID del formulario al ID del objeto usuario.
        // El backend solo necesita el ID para vincular la clave foránea.
        this.susp.suscripcion.idSuscripcion = this.form.value.suscripcionL; 
        
        // --- FIN DE LA CORRECCIÓN ---
        if (!this.susp.metodoPago) {
            this.susp.metodoPago = new MetodoPago();
        }
        this.susp.metodoPago.idMetodoPago = this.form.value.metodopagoL; 

        this.spS.insert(this.susp).subscribe(data => {
          this.spS.list().subscribe((data) => {
            this.spS.setList(data);
          });
        });
        this.router.navigate(['menu/listarmetodospagos']);
      }
    }
}
