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
  { path: '', 
    component: DashboardAdmiComponent,
    canActivate: [AuthGuard], 
    data: { roles: ['ADMIN'] },
    children: [
      { path: 'admin/dashboard', component: DashboardAdmin },
      { path: 'pages', loadChildren: () => import('./app/dashboard-admin/pages-admin/pages.routes')},
      { path: 'ventas', loadChildren: () => import('./app/dashboard-admin/ventas-admin/ventas.routes')}
    ]
  },

  { path: 'user/dashboard', 
    component: DashboardUserComponent,
    canActivate: [AuthGuard],
    data: { roles: ['USER']}
  },
 
  { path: '**', component: Error}

 
]


// export const routes: Routes = [
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
  
//   // Rutas de autenticación con lazy loading
//   { 
//     path: 'login', 
//     loadComponent: () => import('./authentication/auth-login/auth-login.component').then(c => c.AuthLoginComponent)
//   },
//   { 
//     path: 'register', 
//     loadComponent: () => import('./authentication/register/register.component').then(c => c.RegisterComponent)
//   },
//   { 
//     path: 'forgotpassword', 
//     loadComponent: () => import('./authentication/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent)
//   },
//   { 
//     path: 'denied', 
//     loadComponent: () => import('./authentication/access').then(c => c.Access)
//   },
  
//   // Dashboard con carga perezosa
//   { 
//     path: 'dashboard', 
//     loadComponent: () => import('./pages/dashboard/dashboard').then(c => c.Dashboard),
//     canActivate: [AuthenticatedGuard]
//   },
  
//   // Rutas para administradores
//   { 
//     path: 'admin', 
//     canActivate: [AuthGuard], 
//     data: { roles: ['ADMIN'] },
//     children: [
//       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//       { 
//         path: 'dashboard', 
//         loadComponent: () => import('./dashboard-admin/dashboard-admin.component').then(c => c.DashboardAdminComponent)
//       },
//       { 
//         path: 'productos', 
//         loadComponent: () => import('./productos/productos.component').then(c => c.ProductosComponent)
//       },
//       { 
//         path: 'almacenes', 
//         loadComponent: () => import('./almacenes/almacenes.component').then(c => c.AlmacenesComponent)
//       },
//       { 
//         path: 'inventario', 
//         loadComponent: () => import('./inventario/inventario.component').then(c => c.InventarioComponent)
//       },
//       { 
//         path: 'clientes', 
//         loadComponent: () => import('./clientes/clientes.component').then(c => c.ClientesComponent)
//       },
//       { 
//         path: 'reportes', 
//         loadChildren: () => [
//           { 
//             path: '', 
//             loadComponent: () => import('./reportes/reportes.component').then(c => c.ReportesComponent)
//           },
//           { 
//             path: 'diario', 
//             loadComponent: () => import('./reportes/reportes.component').then(c => c.ReportesComponent),
//             data: { periodo: 'diario' }
//           },
//           { 
//             path: 'semanal', 
//             loadComponent: () => import('./reportes/reportes.component').then(c => c.ReportesComponent),
//             data: { periodo: 'semanal' }
//           },
//           { 
//             path: 'mensual', 
//             loadComponent: () => import('./reportes/reportes.component').then(c => c.ReportesComponent),
//             data: { periodo: 'mensual' }
//           }
//         ]
//       }
//     ]
//   },
  
//   // Rutas para usuarios (vendedores)
//   { 
//     path: 'user', 
//     canActivate: [AuthGuard], 
//     data: { roles: ['USER'] },
//     children: [
//       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//       { 
//         path: 'dashboard', 
//         loadComponent: () => import('./dashboard-user/dashboard-user.component').then(c => c.DashboardUserComponent)
//       },
//       { 
//         path: 'ventas', 
//         loadComponent: () => import('./ventas/ventas.component').then(c => c.VentasComponent)
//       },
//       { 
//         path: 'busqueda', 
//         loadComponent: () => import('./busqueda/busqueda.component').then(c => c.BusquedaComponent)
//       },
//       { 
//         path: 'clientes', 
//         loadComponent: () => import('./clientes/clientes.component').then(c => c.ClientesComponent)
//       }
//     ]
//   },
  
//   // Ruta para errores
//   { 
//     path: '**', 
//     loadComponent: () => import('./authentication/error').then(c => c.Error)
//   }
// ];