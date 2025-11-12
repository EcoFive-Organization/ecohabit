import { Component, OnInit } from '@angular/core';
import { Billetera } from '../../../models/Billetera';
import { Billeteraservice } from '../../../services/billeteraservice';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-billeterainsert',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule],
  templateUrl: './billeterainsert.html',
  styleUrl: './billeterainsert.css',
})
export class Billeterainsert implements OnInit{
  form: FormGroup = new FormGroup({});
  bil: Billetera = new Billetera();
  edicion: boolean = false;

  id: number = 0;
  // Va a manejar varios softwares y los va a almacenar
  listaUsuarios: Usuario[] = []

  constructor(
    private bS: Billeteraservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: Usuarioservice // llamar al Software Service para usar el metodo listar en el selector de registro de licencia

  ) {}

  // Esto se ejecuta ni bien inicia el
  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    // Ni bien inicia el componente la listaSoftwares se llena
    this.uS.list().subscribe((data) => {
      this.listaUsuarios = data
    })

    this.form = this.formBuilder.group({
      id: [''],
      usuarioL: ['', Validators.required],
      saldo: ['', Validators.required] // FK de Software
    });
  }
  aceptar(): void {
    if (this.form.valid) {
      this.bil.idBilletera = this.form.value.id;
      this.bil.usuario.nombre = this.form.value.usuarioL; //Fk de Software
      this.bil.saldo = this.form.value.saldo;

      if (this.edicion) {
        this.bS.update(this.bil).subscribe(() => {
          this.bS.list().subscribe((data) => {
            this.bS.setList(data);
          });
        });
      } else {
        this.bS.insert(this.bil).subscribe((data) => {
          this.bS.list().subscribe((data) => {
            this.bS.setList(data);
          });
        });
      }
      this.router.navigate(['billeteras']);
    }
  }
  // Al momento de actualizar algún registro trae toda la data en los campos, la FK
  init() {
    if (this.edicion) {
      this.bS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          id: new FormControl(data.idBilletera),
          usuarioL: new FormControl(data.usuario.nombre),
          saldo: new FormControl(data.saldo)
        });
      });
    }
  }
}
