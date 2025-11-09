import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Usuario } from '../../../models/Usuario';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Usuarioservice } from '../../../services/usuarioservice';

@Component({
  selector: 'app-usuarioinsert',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './usuarioinsert.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './usuarioinsert.css',
})
export class Usuarioinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  usuario: Usuario = new Usuario();

  edicion: boolean = false; // para la logica de actualización de datos
  id: number = 0; // para almacenar el id del usuario a editar

  constructor(
    private usuarioService: Usuarioservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      // de la ruta edits/:id que llega (está en app routes.ts) que capture el id
      this.id = data['id'];

      this.edicion = data['id'] != null; // si hay id, estamos en edición

      this.init();
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      contrasenia: ['', Validators.required],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.usuario.idUsuario = this.form.value.codigo;
      this.usuario.nombre = this.form.value.nombre;
      this.usuario.email = this.form.value.email;
      this.usuario.passwordHash = this.form.value.contrasenia;

      // Si edicion es true llama al metodo update, si no va a registrar
      if (this.edicion) {
        // Insertar soft y setearlo en la lista
        this.usuarioService.update(this.usuario).subscribe((data) => {
          this.usuarioService.list().subscribe((data) => {
            this.usuarioService.setList(data);
          });
        });
      } else {
        // Insertar soft y setearlo en la lista
        this.usuarioService.insert(this.usuario).subscribe((data) => {
          this.usuarioService.list().subscribe((data) => {
            this.usuarioService.setList(data);
          });
        });
      }

      // Una vez inserta redirige a la lista de softwares, se ingresa la ruta a donde quieres que navegue
      this.router.navigate(['listausuarios']);
    }
  }

  init() {
    if (this.edicion) {
      this.usuarioService.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idUsuario),
          nombre: new FormControl(data.nombre),
          email: new FormControl(data.email),
          contrasenia: new FormControl(data.passwordHash),
        });
      });
    }
  }
}
