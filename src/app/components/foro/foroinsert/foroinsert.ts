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
import { Foro } from '../../../models/Foro';
import { Foroservice } from '../../../services/foroservice';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-foroinsert',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './foroinsert.html',
  styleUrl: './foroinsert.css',
})
export class Foroinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  foro: Foro = new Foro();

  edicion: boolean = false;
  id: number = 0;

  constructor(
    private fS: Foroservice,
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
      descripcion: ['', Validators.required],
    });
  }
  aceptar(): void {
    if (this.form.valid) {
      this.foro.idForo = this.form.value.codigo;
      this.foro.titulo = this.form.value.titulo;
      this.foro.descripcion = this.form.value.descripcion;
      if (this.edicion) {
        this.fS.update(this.foro).subscribe((data) => {
          this.fS.list().subscribe((data) => {
            this.fS.setList(data);
          });
        });
      } else {
        this.fS.insert(this.foro).subscribe((data) => {
          this.fS.list().subscribe((data) => {
            this.fS.setList(data);
          });
        });
      }
      this.router.navigate([`menu/listarforos`]);
    }
  }
  init() {
    if (this.edicion) {
      this.fS.listid(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idForo),
          titulo: new FormControl(data.titulo),
          descripcion: new FormControl(data.descripcion),
        });
      });
    }
  }
}
