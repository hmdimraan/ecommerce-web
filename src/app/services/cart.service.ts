import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private api = `${environment.apiUrl}/cart`;

  constructor(
    private http: HttpClient
  ) {}

  getCart() {
    return this.http.get<any>(
      this.api
    );
  }

  addToCart(
    productId: number,
    quantity: number = 1
  ) {
    return this.http.post(
      `${this.api}/add`,
      {
        productID: productId,
        quantity: quantity
      }
    );
  }

  updateQuantity(
    productId: number,
    quantity: number
  ) {
    return this.http.put(
      `${this.api}/update`,
      {
        productID: productId,
        quantity: quantity
      }
    );
  }

  removeItem(productId: number) {
    return this.http.delete(
      `${this.api}/remove/${productId}`
    );
  }

  clearCart() {
    return this.http.delete(
      `${this.api}/clear`
    );
  }
}