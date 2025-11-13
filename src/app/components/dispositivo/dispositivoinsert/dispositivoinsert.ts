import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Dispositivo } from '../../../models/Dispositivo';
import { Usuario } from '../../../models/Usuario';
import { Dispositivoservice } from '../../../services/dispositivoservice';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Usuarioservice } from '../../../services/usuarioservice';

@Component({
  selector: 'app-dispositivoinsert',
  imports: [ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatSelectModule, CommonModule, MatNativeDateModule, MatButtonModule],
  templateUrl: './dispositivoinsert.html',
  styleUrl: './dispositivoinsert.css',
})
export class Dispositivoinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  dispositivo: Dispositivo = new Dispositivo();
  edicion: boolean = false;

  id: number = 0;
  today = new Date();

  // Va a manejar varios usuarios y los va a almacenar
  listaUsuarios: Usuario[] = []

  constructor(
    private dS: Dispositivoservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: Usuarioservice
  ) {}

  // Esto se ejecuta ni bien inicia el programa
  ngOnInit(): void {
      this.route.params.subscribe((data: Params) => {
        this.id = data['id'];
        this.edicion = data['id'] != null;
        this.init();
      })

      // Ni bien inicia el componente la listaSoftwares se llena
      this.uS.list().subscribe((data => {
        this.listaUsuarios = data;
      }))

      this.form = this.formBuilder.group({
        id: [''],
        nombre: ['', Validators.required],
        tipo: ['', Validators.required],
        ubicacion: ['', Validators.required],
        fechaRegistro: ['', Validators.required],
        usuario: ['', Validators.required] // FK de Usuario
      })
  }

  aceptar(): void {
    if (this.form.valid) {
      this.dispositivo.idDispositivo = this.form.value.id;
      this.dispositivo.nombre = this.form.value.nombre;
      this.dispositivo.tipo = this.form.value.tipo;
      this.dispositivo.ubicacion = this.form.value.ubicacion;
      this.dispositivo.fechaRegistro = this.form.value.fechaRegistro;
      this.dispositivo.usuario.idUsuario = this.form.value.usuario; // FK de Usuario

      if (this.edicion) {
        this.dS.update(this.dispositivo).subscribe(() => {
          this.dS.list().subscribe((data) => {
            this.dS.setList(data);
          })
        })
      } else {
        this.dS.insert(this.dispositivo).subscribe((data) => {
          this.dS.list().subscribe((data) => {
            this.dS.setList(data);
          })
        })
      }

      this.router.navigate(['listadispositivo'])
    }
  }

  // Al momento de actualizar algún registro trae toda la data en los campos, la FK
  init() {
    if (this.edicion) {
      this.dS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          id: new FormControl(data.idDispositivo),
          nombre: new FormControl(data.nombre),
          tipo: new FormControl(data.tipo),
          ubicacion: new FormControl(data.ubicacion),
          fechaRegistro: new FormControl(data.fechaRegistro),
          usuario: new FormControl(data.usuario.idUsuario)

        })
      })
    }
  }
}
