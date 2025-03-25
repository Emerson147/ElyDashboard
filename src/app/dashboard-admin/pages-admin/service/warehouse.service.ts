import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/enviroment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class WarehouseService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders { 
    // Try to get token from different possible keys
    const authToken = localStorage.getItem('authToken');
    const token = localStorage.getItem('token');
    const auth_token = localStorage.getItem('auth_token');
    
    // Use the first valid token found
    const validToken = authToken || token || auth_token;
    
    console.log('Token being used:', validToken ? validToken.substring(0, 20) + '...' : 'No token found');
    
    if (!validToken) {
      console.error('No valid authentication token found in localStorage');
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${validToken}`,
      'Content-Type': 'application/json'
    });
  }

  getAllWarehouse(): Observable<any> {
    const headers = this.getAuthHeaders(); 
    return this.http.get(`${this.apiUrl}/warehouse/get`, { headers });
  }

  saveWarehouse(warehouse: any): Observable<any> {
    const headers = this.getAuthHeaders(); 
    return this.http.post(`${this.apiUrl}/warehouse/add`, warehouse, { headers });
  }

  updateWarehouse(warehouse: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    console.log("Token being sent:", token?.substring(0, 20) + "..."); // Muestra solo parte del token por seguridad

    const headers = this.getAuthHeaders();

    // Simplifica el cuerpo al minimo que funciona en postman
    const  requestBody = {
      id: warehouse.id,
      name: warehouse.name,
      location: warehouse.location,
      description: warehouse.description
    };

    console.log("Request body:", requestBody); // Para la depuracion
    // Incluir el ID en la URL como parametro de ruta
    return this.http.post(`${this.apiUrl}/warehouse/update`, requestBody, {headers: headers});
  }
  
  deleteWarehouse(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/warehouse/delete/${id}`, {},{ headers });
  }
}

