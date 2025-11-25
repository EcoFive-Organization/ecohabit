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
import { Suscripcion } from './components/suscripcion/suscripcion';
import { Suscripcioninsert } from './components/suscripcion/suscripcioninsert/suscripcioninsert';

export const routes: Routes = [
  // Zona pública
  // Landing Page
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'registrousuario', component: Usuarioinsert },

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
        ],
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
      },
      // Contenido Educativo
      {
        path: 'listarcontenidoeducativo',
        component: Contenidoeducativo,
        children: [
          { path: 'registrocontenidoeducativo', component: Contenidoeducativoinsert },
          { path: 'edits/:id', component: Contenidoeducativoinsert },
        ],
      },
      // Plan Suscripcion
      { path: 'listarplansuscripcion', component: Plansuscripcion },
      // Billetera
      {
        path: 'listarbilleteras',
        component: Billetera,
        children: [
          { path: 'registrobilleteras', component: Billeterainsert },
          { path: 'edits/:id', component: Billeterainsert },
        ],
      },
      // Transaccion
      {
        path: 'listartransacciones',
        component: Transaccion,
        children: [
          { path: 'registrotransacciones', component: Transaccioninsert },
          { path: 'edits/:id', component: Transaccioninsert },
        ],
      },
      // Dispositivo
      {
        path: 'listadispositivo',
        component: Dispositivo,
        children: [
          { path: 'registrodispositivo', component: Dispositivoinsert },
          { path: 'edits/:id', component: Dispositivoinsert },
        ],
      },

      // Consumo
      {
        path: 'listarconsumo',
        component: Consumo,
        children: [{ path: 'registroconsumo', component: Consumoinsert }],
      },

      // Suscripcion
      {
        path: 'listarsuscripcion',
        component: Suscripcion,
        children: [{
          path: 'registrosuscripcion', component: Suscripcioninsert
        }]
      }

    ],
  },
];
