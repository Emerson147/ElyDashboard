import { Component } from '@angular/core';
import { AppLayout } from "../dashboard-user/layout-user/component/app.layout";

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  imports: [AppLayout],
  templateUrl: './dashboard-user.component.html'
})
export class DashboardUserComponent {

}
