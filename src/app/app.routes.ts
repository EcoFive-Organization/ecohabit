import { Routes } from '@angular/router';
import { Usuario } from './components/usuario/usuario';
import { Foro } from './components/foro/foro';

export const routes: Routes = [
    {path: 'listausuarios', component: Usuario,
        children: []
    },
    {path: 'listarforos', component: Foro,
        children: []
    }
];
