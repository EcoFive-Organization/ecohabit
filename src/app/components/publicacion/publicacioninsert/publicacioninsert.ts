import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Publicacion } from '../../../models/Publicacion';
import { Foro } from '../../../models/Foro';
import { Publicacionservice } from '../../../services/publicacionservice';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Foroservice } from '../../../services/foroservice';
import { Loginservice } from '../../../services/loginservice';

@Component({
  selector: 'app-publicacioninsert',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatNativeDateModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './publicacioninsert.html',
  styleUrl: './publicacioninsert.css',
})
export class Publicacioninsert implements OnInit {
  form: FormGroup = new FormGroup({})
  publicacion: Publicacion = new Publicacion()

  edicion: boolean = false;
  id: number = 0
  today = new Date();

  privacidades: { value: string; viewValue: string }[] = [
    {value: 'Público', viewValue: 'Público'},
    {value: 'Privado', viewValue: 'Privado'},
    {value: 'Solo amigos', viewValue: 'Solo amigos'}
  ]

  listaForos: Foro[] = []

  constructor(
    private pS: Publicacionservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private fS: Foroservice,
    private lS: Loginservice
  ) {}

  ngOnInit(): void {
    

    this.form = this.formBuilder.group({
      id: [''],
      titulo: ['', [Validators.required, Validators.minLength(4)]],
      contenido: ['', [Validators.required, Validators.maxLength(255)]],
      privacidad: ['', Validators.required],
      fecha: [new Date(), Validators.required],
      vistas: ['', [Validators.required, Validators.min(0)]],
      compartidos: ['', [Validators.required, Validators.min(0)]],
      foro: ['', Validators.required],
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.fS.list().subscribe((data) => {
      this.listaForos = data;
    });
    
  }

  aceptar(): void {
    if (this.form.valid) {

      this.publicacion.foro = new Foro();

      this.publicacion.idPublicacion = this.form.value.id;
      this.publicacion.titulo = this.form.value.titulo;
      this.publicacion.contenido = this.form.value.contenido;
      this.publicacion.privacidad = this.form.value.privacidad;
      this.publicacion.fecha = this.form.value.fecha;
      this.publicacion.vistas = this.form.value.vistas;
      this.publicacion.compartidos = this.form.value.compartidos;
      this.publicacion.foro.idForo = this.form.value.foro;

      const idUsuarioLogeado = this.lS.getId();

      this.publicacion.usuario.idUsuario = idUsuarioLogeado;


      if (this.edicion) {
        this.pS.update(this.publicacion).subscribe((data) => {
          this.pS.list().subscribe((data) => {
            this.pS.setList(data)
            this.router.navigate(['menu/listarpublicaciones']);
          })
        })
      } else {
        this.pS.insert(this.publicacion).subscribe((data) => {
          this.pS.list().subscribe((data) => {
            this.pS.setList(data);
            this.router.navigate(['menu/listarpublicaciones']);
          });
        });
      }
    }
  }

  init() {
    if (this.edicion) {
      this.pS.listId(this.id).subscribe((data) => {
        this.form.patchValue({
          id: data.idPublicacion,
          titulo: data.titulo,
          contenido: data.contenido,
          privacidad: data.privacidad,
          fecha: data.fecha,
          vistas: data.vistas,
          compartidos: data.compartidos,
          foro: data.foro.idForo,
        })
      })
    }
  }

}
