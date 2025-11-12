import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
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

@Component({
  selector: 'app-recompensainsert',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
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
    this.route.params.subscribe((data: Params) => {
      this.id = data[`id`];
      this.edicion = data[`id`] != null;
      this.init();
    });
    this.form = this.formBuilder.group({
      codigo: [``],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      costoPuntos: ['', Validators.required],
    });
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
      this.router.navigate([`listarrecompensa`]);
    }
  }
  init() {
    if (this.edicion) {
      this.rS.listid(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idRecompensa),
          nombre: new FormControl(data.nombre),
          descripcion: new FormControl(data.descripcion),
          costoPuntos: new FormControl(data.costoPuntos),
        });
      });
    }
  }
}
