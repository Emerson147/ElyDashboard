import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Crea los headers de autenticación para las peticiones HTTP
   */
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

  /**
   * Obtiene todos los usuarios
   */
  getAllUsers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/user/get`, { headers });
  }

  /**
   * Obtiene un usuario por su ID
   */
  getUserById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/users/${id}`, { headers });
  }

  /**
   * Crea un nuevo usuario
   */
  saveUser(user: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/user/signup`, user, { headers });
  }

  /**
   * Actualiza un usuario existente
   * Nota: Usamos POST en lugar de PUT para evitar problemas de CORS
   */
  updateUser(user: any): Observable<any> {
    const headers = this.getAuthHeaders();

    const requestBody = {
      id: user.id,
      name: user.name,
      email: user.email,
      contactNumber: user.contactNumber,
      role: user.role,
      status: user.status
    };
    console.log("🚀 ~ UserService ~ updateUser ~ requestBody:", requestBody)

    return this.http.post<any>(`${this.apiUrl}/user/updateUser`, requestBody, { headers });
  }

  /**
   * Elimina un usuario por su ID
   * Nota: Usamos POST en lugar de DELETE para evitar problemas de CORS
   */
  deleteUser(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/user/delete/${id}`, {}, { headers });
  }
}
