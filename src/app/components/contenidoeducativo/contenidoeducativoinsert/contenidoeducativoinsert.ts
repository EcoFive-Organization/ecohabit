import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContenidoEducativo } from '../../../models/ContenidoEducativo';
import { Contenidoeducativoservice } from '../../../services/contenidoeducativoservice';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contenidoeducativoinsert',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './contenidoeducativoinsert.html',
  styleUrl: './contenidoeducativoinsert.css',
})
export class Contenidoeducativoinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  contenido: ContenidoEducativo = new ContenidoEducativo();

  edicion: boolean = false;
  id: number = 0;

  tipos: string[] = ['Lectura', 'Video'];

  constructor(
    private ceS: Contenidoeducativoservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1. Configuramos el formulario UNA SOLA VEZ con todas sus validaciones
    this.form = this.formBuilder.group({
      codigo: [''],
      titulo: ['', Validators.required],
      tipo: ['', Validators.required],
      url: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      fecha: [new Date(), Validators.required],
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init(); // Si es edición, llenamos los datos
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.contenido.idContenidoEducativo = this.form.value.codigo;
      this.contenido.titulo = this.form.value.titulo;
      this.contenido.tipo = this.form.value.tipo;
      this.contenido.url = this.form.value.url;
      this.contenido.descripcion = this.form.value.descripcion;
      this.contenido.fechaPublicacion = this.form.value.fecha;

      if (this.edicion) {
        this.ceS.update(this.contenido).subscribe((data) => {
          this.ceS.list().subscribe((data) => {
            this.ceS.setList(data);
          });
        });
      } else {
        this.ceS.insert(this.contenido).subscribe((data) => {
          this.ceS.list().subscribe((data) => {
            this.ceS.setList(data);
          });
        });
      }
      this.router.navigate(['menu/listarcontenidoeducativo']);
    }
  }

  init() {
    if (this.edicion) {
      this.ceS.listid(this.id).subscribe((data) => {
        // 🔴 CORRECCIÓN: Usamos patchValue para inyectar los valores 
        // sin borrar las validaciones definidas en ngOnInit
        this.form.patchValue({
          codigo: data.idContenidoEducativo,
          titulo: data.titulo,
          tipo: data.tipo,
          url: data.url,
          descripcion: data.descripcion,
          fecha: data.fechaPublicacion,
        });
      });
    }
  }
}