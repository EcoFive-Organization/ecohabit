import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
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
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-contenidoeducativoinsert',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './contenidoeducativoinsert.html',
  styleUrl: './contenidoeducativoinsert.css',
})
export class Contenidoeducativoinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  contenido: ContenidoEducativo = new ContenidoEducativo();

  edicion: boolean = false;
  id: number = 0;

  constructor(
    private ceS: Contenidoeducativoservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data[`id`];
      this.edicion = data[`id`] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      codigo: [``],
      titulo: ['', Validators.required],
      tipo: ['', Validators.required],
      url: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
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
      this.router.navigate([`listarcontenidoeducativo`]);
    }
  }

  init() {
    if (this.edicion) {
      this.ceS.listid(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idContenidoEducativo),
          titulo: new FormControl(data.titulo),
          tipo: new FormControl(data.tipo),
          url: new FormControl(data.url),
          descripcion: new FormControl(data.descripcion),
          fecha: new FormControl(data.fechaPublicacion),
        });
      });
    }
  }
}
