import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule, // Importante para formularios
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Usuario } from '../../../models/Usuario';
import { Router, RouterLink } from '@angular/router'; // Importar RouterLink
import { Usuarioservice } from '../../../services/usuarioservice';
import { MatCardModule } from '@angular/material/card'; // Importar Card
import { MatIconModule } from '@angular/material/icon'; // Importar Icon
import { CommonModule } from '@angular/common'; // Importar CommonModule (para *ngIf)

// --- Validador personalizado ---
// (Puedes poner esto al final del archivo, fuera de la clase)
export function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('contrasenia')?.value;
  const confirmPassword = control.get('confirmarContrasenia')?.value;
  // Si las contraseñas no coinciden, devuelve un error
  return password === confirmPassword ? null : { passwordMismatch: true };
}
// -----------------------------

@Component({
  selector: 'app-usuarioinsert',
  standalone: true, // Componente standalone
  imports: [
    CommonModule, // Necesario para directivas como *ngIf
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule, // Módulo para la tarjeta
    MatIconModule, // Módulo para los iconos (ojo de contraseña)
    RouterLink, // Módulo para routerLink (enlaces de navegación)
  ],
  templateUrl: './usuarioinsert.html',
  styleUrl: './usuarioinsert.css',
})
export class Usuarioinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  usuario: Usuario = new Usuario();
  hidePassword = true; // Para el toggle de contraseña
  hideConfirmPassword = true; // Para el toggle de confirmar contraseña

  constructor(
    private usuarioService: Usuarioservice,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        // 1. Campo 'nombre' añadido
        nombre: ['', Validators.required],
        
        // 2. Campo 'email' con validación
        email: ['', [Validators.required, Validators.email]],
        
        // 3. Campo 'contrasenia' con validaciones complejas
        contrasenia: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/), // Requiere 1 mayúscula y 1 número
          ],
        ],
        
        // 4. Campo 'confirmarContrasenia'
        confirmarContrasenia: ['', Validators.required],
      },
      {
        // 5. Validador a nivel de grupo para comparar contraseñas
        validators: passwordMatchValidator,
      }
    );
  }

  aceptar(): void {
    if (this.form.valid) {
      // Asignamos los valores del formulario al objeto usuario
      this.usuario.nombre = this.form.value.nombre;
      this.usuario.email = this.form.value.email;
      this.usuario.passwordHash = this.form.value.contrasenia;
      // this.usuario.enabled = true; // (Ya está por defecto en tu modelo)

      // Lógica de solo INSERCIÓN
      this.usuarioService.insert(this.usuario).subscribe((data) => {
        this.usuarioService.list().subscribe((data) => {
          this.usuarioService.setList(data);
        });
        // Redirige al login (ruta vacía) después del registro
        this.router.navigate(['/']); 
      });
    } else {
      // Opcional: marca todos los campos como "tocados" para mostrar errores
      this.form.markAllAsTouched();
    }
  }

  // --- Getters para facilitar la validación en el HTML ---
  get nombre() {
    return this.form.get('nombre');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('contrasenia');
  }
  get confirmPassword() {
    return this.form.get('confirmarContrasenia');
  }
}