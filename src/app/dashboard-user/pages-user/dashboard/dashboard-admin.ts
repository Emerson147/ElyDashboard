import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { DashboardWidget } from './components/dashboardwidget';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget, ButtonModule, DashboardWidget],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-dashboard-widget class="contents"/>
            <app-stats-widget class="contents" />
            <div class="col-span-12 xl:col-span-6">
                <app-recent-sales-widget />
                <app-best-selling-widget />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-notifications-widget />
            </div>
        </div>
    `
})
export class DashboardUser {

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
