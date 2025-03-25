import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './app/core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {

  constructor(private authService: AuthService) {}

  // ngOnInit(): void {
  //   if(this,this.authService.isAuthenticated()) {
  //     this.authService.autoRefreshToken()
  //   } 
  // }

}
