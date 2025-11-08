import { Routes } from '@angular/router';
import { Usuario } from './components/usuario/usuario';
import { Home } from './components/home/home';

export const routes: Routes = [
    /*
    {path: 'listausuarios', component: Usuario,
        children: []
    } */
   { path: '', component: Home },
   { path: 'listausuarios', component: Usuario }
];
