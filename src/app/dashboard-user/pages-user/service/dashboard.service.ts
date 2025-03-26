import { environment } from "../../../../environments/enviroment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../../../core/services/auth.service";

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  url = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getDetails() {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.url}/dashboard/details`, { headers });
  }
}