import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Rol } from '../../../models/Rol';
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Rolservice } from '../../../services/rolservice';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-rolinsert',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './rolinsert.html',
  styleUrl: './rolinsert.css',
})
export class Rolinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  rol: Rol = new Rol();

  id: number = 0;

  roles: string[] = ['ADMIN', 'CLIENT'];

  listaUsuarios: Usuario[] = [];

  constructor(
    private rS: Rolservice,
    private uS: Usuarioservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
    });

    this.uS.list().subscribe((data) => {
      this.listaUsuarios = data;
    });

    this.form = this.formBuilder.group({
      idrol: [''],
      nombreRol: ['', Validators.required],
      usuario: ['', Validators.required],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.rol.idRol = this.form.value['idrol'];
      this.rol.nombreRol = this.form.value['nombreRol'];
      this.rol.usuario.idUsuario = this.form.value['usuario'];

      this.rS.insert(this.rol).subscribe((data) => {
        this.rS.list().subscribe((data) => {
          this.rS.setList(data);
        });
      });
      this.router.navigate(['menu/listarroles']);
    }
  }
}
