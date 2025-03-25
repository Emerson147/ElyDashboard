import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private tokenKey = 'authToken';
  private userRoleKey = 'userRole';

  constructor(private http: HttpClient, private router: Router) { }

  //Servicio del registro de usuraios
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/signup`, user);
  }

  //Servicio del Login 
  login( email: string, password: string ): Observable<any> {
    const body = {email, password};

    return this.http.post(`${this.apiUrl}/user/login`, body).pipe(
      tap((response: any) => {
        console.log('raw response:', response)
        if (response.token) {
          this.setToken(response.token);

          //Guardar el rol de lUsuario
          if  (response.role) {
            this.setUserRole(response.role);
            this.redirectBasedOnRole(response.role);
          }
        }
      })
    );
  }

  //Guuarda el token en el localstorage
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  //Guarda el rol de lusuario
  private setUserRole(role: string): void {
    localStorage.setItem(this.userRoleKey, role)
  } 

  //Obtiene el rol del Usuario
  getUserRole(): string | null {
    return localStorage.getItem(this.userRoleKey)
  }

  // Redirige segun el rol 
  private redirectBasedOnRole(role: string): void {
    switch(role.toUpperCase()) {
      case 'admin':
        this.router.navigate(['/admin/dashboard'])
        break
      case 'user':
        this.router.navigate(['/user/dashboard']);
        break
      default:
        this.router.navigate(['/login'])
    }
  }

  // Verificar si tiene aaceso a una ruta especifica
  hasRole(allowedRoles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? allowedRoles.includes(userRole.toUpperCase()) : false
  }

  //Obtiene el token
  private getToken(): string | null {
    if(typeof window !== 'undefined' ){
      return localStorage.getItem(this.tokenKey);
    } else {
      return null;
    }
  }

  //Autentifica si es admin para el acceso al dashboard en caso que no redirige error
  isAuthenticated(): boolean {
    const token = this.getToken();
    if(!token) {
      return false;
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/forgotPassword`,{email})
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userRoleKey);
  }
}
