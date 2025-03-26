import { Component } from '@angular/core';
import { NotificationsWidget } from '../../pages-user/dashboard/components/notificationswidget';
import { StatsWidget } from '../../pages-user/dashboard/components/statswidget';
import { RecentSalesWidget } from '../../pages-user/dashboard/components/recentsaleswidget';
import { BestSellingWidget } from '../../pages-user/dashboard/components/bestsellingwidget';
import { RevenueStreamWidget } from '../../pages-user/dashboard/components/revenuestreamwidget';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { DashboardWidget } from '../../pages-user/dashboard/components/dashboardwidget';

@Component({
    standalone: true,
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
