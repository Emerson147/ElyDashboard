import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '../component/app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/pages/dashboard'] },
                    { label: 'Usuarios', icon: 'pi pi-user ', routerLink: ['/pages/usuarios'] },
                    { label: 'Categoria', icon: 'pi pi-fw pi-tags', routerLink: ['/pages/categoria'] },
                    { label: 'Producto', icon: 'pi pi-fw pi-shopping-bag', routerLink: ['/pages/producto'] },
                    { label: 'Factura', icon: 'pi pi-fw pi-file', routerLink: ['/pages/factura'] },
                    { label: 'Almacén', icon: 'pi pi-fw pi-warehouse', routerLink: ['/pages/almacen'] },
                ]
            },
            {
                label: 'Ventas',
                items: [
                    { label: 'Clientes', icon: 'pi pi-fw pi-user', routerLink: ['/pages/clientes'] },
                    { label: 'Ventas', icon: 'pi pi-fw pi-shopping-bag', routerLink: ['/pages/ventas'] },
                    { label: 'Busqueda', icon: 'pi pi-fw pi-search', routerLink: ['/pages/busqueda'] }
                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/pages/empty']
                    }
                ]
            }
        ];
    }
}
