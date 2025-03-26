import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/enviroment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
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

  getAllProducts(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/product/get`, { headers });
  }

  getProductById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/product/get/${id}`, { headers });
  }

  createProduct(product: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/product/add`, product, { headers });
  }

  updateProduct(product: any): Observable<any> {
    const headers = this.getAuthHeaders();
    // Usando POST en lugar de PUT para evitar problemas de CORS
    return this.http.post(`${this.apiUrl}/product/update/${product.id}`, product, { headers });
  }

  deleteProduct(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    // Usando POST en lugar de DELETE para evitar problemas de CORS
    return this.http.post(`${this.apiUrl}/product/delete/${id}`, {}, { headers });
  }
}