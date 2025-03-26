import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { ProductoComponent } from './producto/producto.component';
import { FacturaComponent } from './factura/factura.component';
import { AlmacenComponent } from './almacen/almacen.component';
import { DashboardUser } from './dashboard/dashboard-user';


export default [
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    // { path: '**', redirectTo: '/notfound' },
    { path: 'dashboard', component: DashboardUser },
    { path: 'usuarios', component: UsuariosComponent},
    { path: 'categoria', component: CategoriaComponent},
    { path: 'producto', component: ProductoComponent},
    { path: 'factura', component: FacturaComponent},
    { path: 'almacen', component: AlmacenComponent}
] as Routes;
    
