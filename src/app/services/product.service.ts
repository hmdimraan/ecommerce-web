import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/products`
    );
  }

  getProductRecommendations(productId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/products/recommend/${productId}`
    );
  }

  getUserRecommendations(userId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/products/recommend/user/${userId}`
    );
  }
}