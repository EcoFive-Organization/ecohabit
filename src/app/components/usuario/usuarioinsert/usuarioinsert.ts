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
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('contrasenia')?.value;
  const confirmPassword = control.get('confirmarContrasenia')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
// -----------------------------

@Component({
  selector: 'app-usuarioinsert',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './usuarioinsert.html',
  styleUrl: './usuarioinsert.css',
})
export class Usuarioinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  usuario: Usuario = new Usuario();
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private usuarioService: Usuarioservice,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        nombre: ['', Validators.required], // *** ¡AQUÍ ESTÁ LA CORRECCIÓN! ***
        email: [
          '',
          [
            Validators.required,
            // Reemplazamos Validators.email por una RegEx más estricta
            // Esta RegEx busca el formato: texto@texto.texto (ej. hola@gmail.com)
            Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
          ],
        ],
        contrasenia: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
          ],
        ],
        confirmarContrasenia: ['', Validators.required],
      },
      {
        validators: passwordMatchValidator,
      }
    );
  }

  aceptar(): void {
    if (this.form.valid) {
      const payload = {
        nombre: this.form.value.nombre,
        email: this.form.value.email,
        passwordHash: this.form.value.contrasenia,
        enabled: true,
      };

      this.usuarioService.insert(payload as Usuario).subscribe({
        next: (data) => {
          console.log('Usuario registrado:', data);
          this.usuarioService.list().subscribe((data) => {
            this.usuarioService.setList(data);
          });
          this.router.navigate(['/menu']);
        },
        error: (err) => {
          console.error('Error durante el registro:', err);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  } // --- Getters (sin cambios) ---

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
