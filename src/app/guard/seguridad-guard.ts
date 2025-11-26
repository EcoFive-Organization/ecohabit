import { CanActivateFn, Router } from '@angular/router';
import { Loginservice } from '../services/loginservice';
import { inject } from '@angular/core';
// 1. Importar MatSnackBar
import { MatSnackBar } from '@angular/material/snack-bar'; 

export const seguridadGuard: CanActivateFn = (route, state) => {

  const lService = inject(Loginservice);
  const router = inject(Router);
  // 2. Inyectar el servicio de notificaciones
  const snackBar = inject(MatSnackBar); 

  const rpta = lService.verificar();

  if (!rpta) {
    // 3. Mostrar el mensaje
    snackBar.open('Debe Iniciar Sesión para acceder a esta página', 'Aceptar', {
      duration: 3000, // El mensaje dura 3 segundos
      horizontalPosition: 'center', // Alineación horizontal
      verticalPosition: 'top', // Aparece arriba (más visible)
    });

    router.navigate(['/login']);
    return false;
  }

  return rpta;
};