import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { AppLayout } from "../dashboard-admin/layout-admin/component/app.layout";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonModule, AppLayout],
  templateUrl: './dashboard-admin.component.html',
})
export class DashboardAdmiComponent {

  constructor (
    private authService: AuthService,
    private router: Router
  ) {}

  onLogout() {
    this.authService.logout();
    setTimeout(() => {
      this.router.navigate(['/login'])
    }, 3000)
  }


}
