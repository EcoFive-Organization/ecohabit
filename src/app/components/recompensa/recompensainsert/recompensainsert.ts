import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Recompensa } from '../../../models/Recompensa';
import { Recompensaservice } from '../../../services/recompensaservice';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-recompensainsert',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSliderModule,
  ],
  templateUrl: './recompensainsert.html',
  styleUrl: './recompensainsert.css',
})
export class Recompensainsert implements OnInit {
  form: FormGroup = new FormGroup({});
  recompensa: Recompensa = new Recompensa();

  edicion: boolean = false;
  id: number = 0;

  constructor(
    private rS: Recompensaservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1. Configuramos el formulario CON VALIDACIONES al inicio
    this.form = this.formBuilder.group({
      codigo: [''],
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      costoPuntos: ['', Validators.required],
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init(); // Si es edición, cargamos los datos
    });
  }

  formatLabel(value: number): string {
    return `${value}`;
  }

  aceptar(): void {
    if (this.form.valid) {
      this.recompensa.idRecompensa = this.form.value.codigo;
      this.recompensa.nombre = this.form.value.nombre;
      this.recompensa.descripcion = this.form.value.descripcion;
      this.recompensa.costoPuntos = this.form.value.costoPuntos;
      
      if (this.edicion) {
        this.rS.update(this.recompensa).subscribe((data) => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
        });
      } else {
        this.rS.insert(this.recompensa).subscribe((data) => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
        });
      }
      this.router.navigate(['menu/listarrecompensa']);
    }
  }

  init() {
    if (this.edicion) {
      this.rS.listid(this.id).subscribe((data) => {
        // 🔴 CORRECCIÓN CLAVE: Usamos patchValue en lugar de new FormGroup
        this.form.patchValue({
          codigo: data.idRecompensa,
          nombre: data.nombre,
          descripcion: data.descripcion,
          costoPuntos: Number(data.costoPuntos ?? 0),
        });
      });
    }
  }
}