import { Component, OnInit } from '@angular/core';
import { Billetera } from '../../../models/Billetera';
import { Billeteraservice } from '../../../services/billeteraservice';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Loginservice } from '../../../services/loginservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-billeterainsert',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: './billeterainsert.html',
  styleUrl: './billeterainsert.css',
})
export class Billeterainsert implements OnInit {
  form: FormGroup = new FormGroup({});
  bil: Billetera = new Billetera();
  edicion: boolean = false;

  id: number = 0;
  // Va a manejar varios softwares y los va a almacenar
  listaUsuarios: Usuario[] = [];

  isAdmin: boolean = false;

  constructor(
    private bS: Billeteraservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: Usuarioservice, // llamar al Software Service para usar el metodo listar en el selector de registro de licencia
    private loginService: Loginservice
  ) {}

  // Esto se ejecuta ni bien inicia el
  ngOnInit(): void {
    this.isAdmin = this.loginService.showRole() === 'ADMIN';

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
    });

    // 2. Solo cargar usuarios si es Admin
    if (this.isAdmin) {
      this.uS.list().subscribe((data) => {
        this.listaUsuarios = data;
      });
    }

    this.form = this.formBuilder.group({
      id: [''],
      usuarioL: ['', this.isAdmin ? Validators.required : null],
      saldo: ['', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]], // FK de Software
    });
  }
  aceptar(): void {
    if (this.form.valid) {
      this.bil.idBilletera = this.form.value.id;

      if (!this.bil.usuario) {
        this.bil.usuario = new Usuario();
      }

      // Solo asignamos el ID del formulario si es ADMIN
      if (this.isAdmin) {
        this.bil.usuario.idUsuario = this.form.value.usuarioL;
      }
      // Si es CLIENT, esto va vacío y el Backend lo rellena con el Token

      this.bil.saldo = this.form.value.saldo;

      this.bS.insert(this.bil).subscribe((data) => {
        this.bS.list().subscribe((data) => {
          this.bS.setList(data);
        });
      });
      this.router.navigate(['menu/listarbilleteras']);
    }
  }
}
