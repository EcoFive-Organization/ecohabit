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


@Component({
  selector: 'app-billeterainsert',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule],
  templateUrl: './billeterainsert.html',
  styleUrl: './billeterainsert.css',
})
export class Billeterainsert implements OnInit{
  form: FormGroup = new FormGroup({});
  bil: Billetera = new Billetera();
  edicion: boolean = false;

  id: number = 0;
  // Va a manejar varios softwares y los va a almacenar
  listaUsuarios: Usuario[] = []

  constructor(
    private bS: Billeteraservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: Usuarioservice // llamar al Software Service para usar el metodo listar en el selector de registro de licencia

  ) {}

  // Esto se ejecuta ni bien inicia el
  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
    });

    // Ni bien inicia el componente la listaSoftwares se llena
    this.uS.list().subscribe((data) => {
      this.listaUsuarios = data
    })

    this.form = this.formBuilder.group({
      id: [''],
      usuarioL: ['', Validators.required],
      saldo: ['', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]] // FK de Software
    });
  }
  aceptar(): void {
    if (this.form.valid) {
      this.bil.idBilletera = this.form.value.id;
      
      // --- ESTA ES LA CORRECCIÓN ---

      // 1. Asegúrate de que el objeto 'usuario' dentro de 'billetera' exista.
      // (Si tu clase Billetera no lo inicializa en el constructor, hazlo aquí)
      if (!this.bil.usuario) {
          this.bil.usuario = new Usuario();
      }

      // 2. Asigna el ID del formulario al ID del objeto usuario.
      // El backend solo necesita el ID para vincular la clave foránea.
      this.bil.usuario.idUsuario = this.form.value.usuarioL; 
      
      // --- FIN DE LA CORRECCIÓN ---

      this.bil.saldo = this.form.value.saldo;

      this.bS.insert(this.bil).subscribe(data => {
        this.bS.list().subscribe((data) => {
          this.bS.setList(data);
        });
      });
      this.router.navigate(['listarbilleteras']);
    }
  }
}
