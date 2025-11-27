import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtener el token del storage (debe coincidir con la llave que usas en login.ts)
    const token = sessionStorage.getItem('token');
    
    console.log('Interceptor funcionando. Token encontrado:', token);
  // 2. Si el token existe, clonamos la petición y le inyectamos el header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedRequest);
  }

  // 3. Si no hay token (ej. login), la petición pasa limpia
  return next(req);
};
