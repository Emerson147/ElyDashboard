import { Routes } from '@angular/router';
import { AuthLoginComponent } from './app/authentication/auth-login/auth-login.component';
import { AuthGuard } from './app/core/guards/auth.guard';
import { RegisterComponent } from './app/authentication/register/register.component';
import { ForgotPasswordComponent } from './app/authentication/forgot-password/forgot-password.component';
import { DashboardUserComponent } from './app/dashboard-user/dashboard-user.component';
import { Access } from './app/authentication/access';
import { Error } from './app/authentication/error';
import { DashboardAdmiComponent} from './app/dashboard-admin/dashboard-admin.component';
import { DashboardAdmin } from './app/dashboard-admin/pages-admin/dashboard/dashboard-admin';


export const routes: Routes = [
  { path: '', redirectTo:'/login', pathMatch: 'full'},

  //Rutas de autentificacion
  { path: 'login', component: AuthLoginComponent   },
  { path: 'register', component: RegisterComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent},
  { path: 'denied', component: Access },

  //Rutas para administradores
  { path: '', component: DashboardAdmiComponent,
    canActivate: [AuthGuard], 
    data: { roles: ['ADMIN'] },
    children: [
      { path: 'admin/dashboard', component: DashboardAdmin },
      { path: 'pages', loadChildren: () => import('./app/dashboard-admin/pages-admin/pages.routes')}
    ]
  },

  { path: 'user/dashboard', component: DashboardUserComponent,
    canActivate: [AuthGuard],
    data: { roles: ['USER']}

  },
 
  { path: '**', component: Error}

 
];
