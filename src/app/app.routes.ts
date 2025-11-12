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

export const routes: Routes = [
    { path: '', component: Home},
    { path: 'registrousuario', component: Usuarioinsert },
    { path: 'listausuarios', component: Usuario,
        children: [
            {path: 'registrousuario', component: Usuarioinsert},
            // Los dos puntos indican que es una variable
            {path: 'edits/:id', component: Usuarioinsert} // Esta ruta sirve para cuando le demos al botón actualizar lleve al formulario de registro
        ]
    },
    {path: 'listarforos', component: Foro,
        children: [
            {path: 'registroforo', component: Foroinsert},
            // Los dos puntos indican que es una variable
            {path: 'edits/:id', component: Foroinsert}
        ]
    },
    {path: 'listarrecompensa', component: Recompensa,
        children: [
            {path: 'registrorecompensa', component: Recompensainsert},
            // Los dos puntos indican que es una variable
            {path: 'edits/:id', component: Recompensainsert}
        ]
    },
    {path: 'listarcontenidoeducativo', component: Contenidoeducativo,
        children: [
            {path: 'registrocontenidoeducativo', component: Contenidoeducativoinsert},
            {path: 'edits/:id', component: Contenidoeducativoinsert}
        ]
    },
    {path:'listarplansuscripcion', component:Plansuscripcion}
];
