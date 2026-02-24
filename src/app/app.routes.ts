import { Routes } from '@angular/router';
import { NoAuth } from './modules/no-auth/no-auth';
import { SignIn } from './modules/no-auth/sign-in/sign-in';
import { Root } from './modules/root/root';
import { Dashboard } from './modules/root/dashboard/dashboard';
import { AuthGuard } from './guards/auth-guard';
import { ConfiguracionCarga } from './modules/root/configuracion-carga/configuracion-carga';
import { Solicitudes } from './modules/root/solicitudes/solicitudes';

export const routes: Routes = [
    {
        path: '',
        component: Root,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: Dashboard
            },
            {
                path: 'configuracion-carga',
                component: ConfiguracionCarga
            },
            {
                path: 'solicitudes',
                component: Solicitudes
            }
        ]
    },
    {
        path: 'no-auth',
        component: NoAuth,
        children: [
            {
                path: '',
                redirectTo: 'sign-in',
                pathMatch: 'full'
            },
            {
                path: 'sign-in',
                component: SignIn
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'no-auth/sign-in'
    }
];
