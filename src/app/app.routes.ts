import { Routes } from '@angular/router';
import { Usuario } from './components/usuario/usuario';
import { Foro } from './components/foro/foro';
import { Home } from './components/home/home';
import { Usuarioinsert } from './components/usuario/usuarioinsert/usuarioinsert';
import { Foroinsert } from './components/foro/foroinsert/foroinsert';
import { Recompensainsert } from './components/recompensa/recompensainsert/recompensainsert';
import { Recompensa } from './components/recompensa/recompensa';
import { Plansuscripcion } from './components/plansuscripcion/plansuscripcion';
import { Contenidoeducativo } from './components/contenidoeducativo/contenidoeducativo';
import { Contenidoeducativoinsert } from './components/contenidoeducativo/contenidoeducativoinsert/contenidoeducativoinsert';
import { Billetera } from './components/billetera/billetera';
import { Billeterainsert } from './components/billetera/billeterainsert/billeterainsert';
import { Transaccion } from './components/transaccion/transaccion';
import { Transaccioninsert } from './components/transaccion/transaccioninsert/transaccioninsert';
import { Dispositivo } from './components/dispositivo/dispositivo';
import { Menu } from './components/menu/menu';
import { Dispositivoinsert } from './components/dispositivo/dispositivoinsert/dispositivoinsert';
import { Consumo } from './components/consumo/consumo';
import { Consumoinsert } from './components/consumo/consumoinsert/consumoinsert';
import { Login } from './components/login/login';
import { Suscripcion } from './components/suscripcion/suscripcion';
import { Metodopago } from './components/metodopago/metodopago';
import { Metodopagoinsert } from './components/metodopago/metodopagoinsert/metodopagoinsert';
import { seguridadGuard } from './guard/seguridad-guard';
import { Rol } from './components/rol/rol';
import { Rolinsert } from './components/rol/rolinsert/rolinsert';
import { Dashboard } from './components/dashboard/dashboard';
import { HistorialComponent } from './components/consumo/historial/historial';
import { ReporteCantidadPublicacionForo } from './components/reporte-cantidad-publicacion-foro/reporte-cantidad-publicacion-foro';
import { ReporteCantidadReaccionesPublicacion } from './components/reporte-cantidad-reacciones-publicacion/reporte-cantidad-reacciones-publicacion';
import { ReporteUsuariosComponent } from './components/usuario/reporte-usuarios/reporte-usuarios';
import { ReporteTransaccion } from './components/transaccion/reporte-transaccion/reporte-transaccion';
import { ReporteCantidadTipoConsumo } from './components/consumo/reporte-cantidad-tipo-consumo/reporte-cantidad-tipo-consumo';
import { ReporteConsumoDispositivoComponent } from './components/consumo/reporte-consumo-dispositivo/reporte-consumo-dispositivo';
import { Publicacion } from './components/publicacion/publicacion';
import { Publicacioninsert } from './components/publicacion/publicacioninsert/publicacioninsert';

export const routes: Routes = [
  // Zona pública
  // Landing Page
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'registrousuario', component: Usuarioinsert },
  { path: `login`, component: Login},

  // Zona privada
  // Esta es ahora una ruta principal y reemplazará la página Home
  {
    path: 'menu',
    component: Menu,
    children: [
      // Cuando entras a /menu, se carga el Sidenav.
      { path: 'menu', redirectTo: 'listausuarios',  pathMatch: 'full' },

      // Usuario
      {
        path: 'listausuarios',
        component: Usuario,
        children: [
          { path: 'registrousuario', component: Usuarioinsert },
          // Los dos puntos indican que es una variable
          { path: 'perfil/:id', component: Usuarioinsert }, // Esta ruta sirve para cuando le demos al botón actualizar lleve al formulario de registro
          { path: 'reportes', component: ReporteUsuariosComponent} // NUEVA RUTA PARA EL REPORTE
        ],
        canActivate: [seguridadGuard],
      },
      // Foro
      {
        path: 'listarforos',
        component: Foro,
        children: [
          { path: 'registroforo', component: Foroinsert },
          // Los dos puntos indican que es una variable
          { path: 'edits/:id', component: Foroinsert },
        ],
        //canActivate: [seguridadGuard],
      },
      // Recompensa
      {
        path: 'listarrecompensa',
        component: Recompensa,
        children: [
          { path: 'registrorecompensa', component: Recompensainsert },
          // Los dos puntos indican que es una variable
          { path: 'edits/:id', component: Recompensainsert },
        ],
        canActivate: [seguridadGuard],
      },
      // Contenido Educativo
      {
        path: 'listarcontenidoeducativo',
        component: Contenidoeducativo,
        children: [
          { path: 'registrocontenidoeducativo', component: Contenidoeducativoinsert },
          { path: 'edits/:id', component: Contenidoeducativoinsert },
        ],
        canActivate: [seguridadGuard],
      },
      // Plan Suscripcion
      { path: 'listarplansuscripcion', component: Plansuscripcion,
        canActivate: [seguridadGuard],
      },
      // Billetera
      {
        path: 'listarbilleteras',
        component: Billetera,
        children: [
          { path: 'registrobilleteras', component: Billeterainsert },
          { path: 'edits/:id', component: Billeterainsert },
        ],
        canActivate: [seguridadGuard],
      },
      // Transaccion
      {
        path: 'listartransacciones',
        component: Transaccion,
        children: [
          { path: 'registrotransacciones', component: Transaccioninsert },
          { path: 'edits/:id', component: Transaccioninsert },
          // 🟢 NUEVA RUTA DE REPORTE
        { path: 'reportes', component: ReporteTransaccion },
        ],
        canActivate: [seguridadGuard],
      },
      // Dispositivo
      {
        path: 'listadispositivo',
        component: Dispositivo,
        children: [
          { path: 'registrodispositivo', component: Dispositivoinsert },
          { path: 'edits/:id', component: Dispositivoinsert },
        ],
        canActivate: [seguridadGuard],
      },

      // Consumo
      {
        path: 'listarconsumo',
        component: Consumo,
        children: [
          { path: 'registroconsumo', component: Consumoinsert},
          { path:`historial`, component: HistorialComponent},
        // 🟢 NUEVA RUTA
          { path: 'reporte-cantidad', component: ReporteCantidadTipoConsumo},
          {path: 'reporte-dispositivos', component: ReporteConsumoDispositivoComponent},],
        canActivate: [seguridadGuard],
      },

      // Suscripcion
      {
        path: 'listarsuscripcion',
        component: Suscripcion,
        canActivate: [seguridadGuard],
      },
      
      // MetodoPago
      {
        path: 'listarmetodopago',
        component: Metodopago,
        children: [{
          path: 'registrometodopago', component: Metodopagoinsert
        }],
        canActivate: [seguridadGuard],
      },

      // Rol
      {
        path:`listarroles`,
        component: Rol,
        children: [{
          path:`registrorol`, component: Rolinsert
        }],
        canActivate: [seguridadGuard],
      },

      // Dashboard
      {
        path:`dashboard`,
        component: Dashboard,
        canActivate: [seguridadGuard],
      },

      // Reporte de cantidad de publicaciones segun foro
      {
        path: 'reporte-cantidad-publicaciones-foro',
        component: ReporteCantidadPublicacionForo,
        canActivate: [seguridadGuard]
      },

      // Reporte de cantidad de reacciones según publicación
      {
        path: 'reporte-cantidad-reacciones-publicacion',
        component: ReporteCantidadReaccionesPublicacion,
        canActivate: [seguridadGuard]
      },

      // Publicacion
      {
        path: 'listarpublicaciones',
        component: Publicacion,
        children: [
          { path: 'registropublicacion', component: Publicacioninsert },
          { path: 'edits/:id', component: Publicacioninsert}
        ],
        canActivate: [seguridadGuard]
      }

    ],
    //canActivate: [seguridadGuard],
  },
];
