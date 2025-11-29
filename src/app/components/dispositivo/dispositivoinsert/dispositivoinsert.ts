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
import { Loginservice } from '../../../services/loginservice';

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

  // Lista de tipos
  tipos: string[] = ['Agua', 'Electricidad', 'Gas']

  isAdmin: boolean = false;

  constructor(
    private dS: Dispositivoservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: Usuarioservice,
    private loginService: Loginservice
  ) {}

  // Esto se ejecuta ni bien inicia el programa
  ngOnInit(): void {
    this.isAdmin = this.loginService.showRole() === 'ADMIN';

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    // Solo cargamos usuarios si es Admin (Optimización)
    if (this.isAdmin) {
      this.uS.list().subscribe((data) => {
        this.listaUsuarios = data;
      });
    }

    this.form = this.formBuilder.group({
      id: [''],

      // 1. VALIDACIÓN NOMBRE: Obligatorio + Mínimo 4 caracteres
      nombre: ['', [Validators.required, Validators.minLength(4)]],

      tipo: ['', Validators.required],

      // 2. VALIDACIÓN UBICACIÓN: Obligatorio + Solo letras y espacios
      // El regex /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/ asegura que no se puedan poner números ni símbolos raros.
      ubicacion: ['', [Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)]],

      fechaRegistro: [new Date(), Validators.required],
      usuario: ['', this.isAdmin ? Validators.required : null],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.dispositivo.idDispositivo = this.form.value.id;
      this.dispositivo.nombre = this.form.value.nombre;
      this.dispositivo.tipo = this.form.value.tipo;
      this.dispositivo.ubicacion = this.form.value.ubicacion;
      this.dispositivo.fechaRegistro = this.form.value.fechaRegistro;

      // Solo asignamos si el campo existe (Admin)
      if (this.form.value.usuario) {
        this.dispositivo.usuario.idUsuario = this.form.value.usuario;
      }
      // Nota: Si es CLIENT, esto va vacío, pero el Backend lo rellena con el Token.

      if (this.edicion) {
        this.dS.update(this.dispositivo).subscribe(() => {
          this.dS.list().subscribe((data) => {
            this.dS.setList(data);
          });
        });
      } else {
        this.dS.insert(this.dispositivo).subscribe((data) => {
          this.dS.list().subscribe((data) => {
            this.dS.setList(data);
          });
        });
      }

      this.router.navigate(['menu/listadispositivo']);
    }
  }

  // Al momento de actualizar algún registro trae toda la data en los campos, la FK
  init() {
    if (this.edicion) {
      this.dS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          id: new FormControl(data.idDispositivo),
          // IMPORTANTE: Mantener las validaciones también en la edición
          nombre: new FormControl(data.nombre, [Validators.required, Validators.minLength(4)]),
          tipo: new FormControl(data.tipo, Validators.required),
          ubicacion: new FormControl(data.ubicacion, [
            Validators.required,
            Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/),
          ]),
          fechaRegistro: new FormControl(data.fechaRegistro),
          usuario: new FormControl(this.isAdmin ? data.usuario.idUsuario : ''),
        });
      })
    }
  }
}
