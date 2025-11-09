import { Routes } from '@angular/router';
import { Usuario } from './components/usuario/usuario';
<<<<<<< HEAD
import { Foro } from './components/foro/foro';
=======
import { Home } from './components/home/home';
import { Usuarioinsert } from './components/usuario/usuarioinsert/usuarioinsert';
>>>>>>> c5d99a63854431d8e1d42aa7a38286b8519b7c53

export const routes: Routes = [
    /*
    {path: 'listausuarios', component: Usuario,
        children: []
<<<<<<< HEAD
    },
    {path: 'listarforos', component: Foro,
        children: []
=======
    } */
   { path: '', component: Home },
   { path: 'listausuarios', component: Usuario,
        children: [
            {path: 'registrousuario', component: Usuarioinsert},
            // Los dos puntos indican que es una variable
            {path: 'edits/:id', component: Usuarioinsert} // Esta ruta sirve para cuando le demos al botón actualizar lleve al formulario de registro
        ]
>>>>>>> c5d99a63854431d8e1d42aa7a38286b8519b7c53
    }
];
