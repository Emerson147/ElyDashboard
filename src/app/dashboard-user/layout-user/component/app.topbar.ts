import { Component, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { AuthService } from '../../../core/services/auth.service';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [Toast ,RouterModule, CommonModule, StyleClassModule, AppConfigurator, ButtonModule, PopoverModule],
    providers: [MessageService],
    templateUrl: './app.topbar.html' 
})
export class AppTopbar {

    items!: MenuItem[];

    constructor(
        public layoutService: LayoutService,
        private messageService: MessageService,
        private authService: AuthService,
        private router: Router    
    ) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }


    @ViewChild('op') op!: Popover;

    members = [
        { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' },
    ];

    toggle(event: Event) {
        this.op.toggle(event);
    }


    //Cerrar Sesion
    onLogout() {
        this.authService.logout();
        this.messageService.add({
            severity: 'warn',
            summary: 'Adevertencia',
            detail: 'Estas cerrando sesion!'
        })
        setTimeout(() => {
            this.router.navigate(['/login'])
        }, 2000)
    }

}
