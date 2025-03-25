import { environment } from "../../../../environments/enviroment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
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

  getAllCategory(): Observable<any> {
    const headers = this.getAuthHeaders(); 
    return this.http.get(`${this.apiUrl}/category/get`, { headers });
  }

  saveCategory(category: any): Observable<any> {
    const headers = this.getAuthHeaders(); 
    return this.http.post(`${this.apiUrl}/category/add`, category, { headers });
  }

  updateCategory(category: any): Observable<any> {
    const headers = this.getAuthHeaders();
  
    // Simplifica el cuerpo al mínimo que funciona en Postman
    const requestBody = {
      id: category.id,
      name: category.name,
      description: category.description
    };
    console.log("🚀 ~ CategoryService ~ updateCategory ~ requestBody:", requestBody)
          
    // Incluir el ID en la URL como parámetro de ruta
    return this.http.post(`${this.apiUrl}/category/update/${category.id}`, requestBody, {headers: headers});
  }
  
  deleteCategory(id: string): Observable<any> {
    const headers = this.getAuthHeaders(); 
    return this.http.post(`${this.apiUrl}/category/delete/${id}`,{}, { headers });
  }
}