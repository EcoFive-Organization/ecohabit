import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form: FormGroup;
  hidePassword = true;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    // Inicializamos el formulario con validaciones básicas
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]], // Validación de email estándar
      password: ['', Validators.required],
    });
  }

  // Método que se ejecuta al enviar el formulario
  ingresar(): void {
    if (this.form.valid) {
      console.log('Datos del login:', this.form.value);
      // Aquí iría la lógica de conexión al backend.
      // Por ahora, solo redirigimos al menú para simular el éxito.
      this.router.navigate(['/menu']);
    } else {
      // Si el formulario no es válido, marcamos los campos para mostrar errores
      this.form.markAllAsTouched();
    }
  }

  // --- Getters para facilitar el acceso en el HTML ---
  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
