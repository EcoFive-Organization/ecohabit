import { Routes } from '@angular/router';
import { Usuario } from './components/usuario/usuario';

export const routes: Routes = [
    {path: 'listausuarios', component: Usuario,
        children: []
    }
];
