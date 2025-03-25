import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor (
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //Verificar si esta autenticado
    if(!this.authService.isAuthenticated()) {
      this.router.navigate(['/denied']);
      return false;
    }    

    //Verificar roles permitidos 
    const allowedRoles = route.data['roles'] as string[];
    if(allowedRoles && !this.authService.hasRole(allowedRoles)) {
      this.router.navigate(['/denied']);
      return false;
    }
    return true;
  }

}