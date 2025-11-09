import { Routes } from '@angular/router';
import { Usuario } from './components/usuario/usuario';
import { Home } from './components/home/home';
import { Usuarioinsert } from './components/usuario/usuarioinsert/usuarioinsert';

export const routes: Routes = [
    /*
    {path: 'listausuarios', component: Usuario,
        children: []
    } */
   { path: '', component: Home },
   { path: 'listausuarios', component: Usuario,
        children: [
            {path: 'registrousuario', component: Usuarioinsert},
            // Los dos puntos indican que es una variable
            {path: 'edits/:id', component: Usuarioinsert} // Esta ruta sirve para cuando le demos al botón actualizar lleve al formulario de registro
        ]
    }
];
