import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private apiUrl = environment.apiUrl + '/activity';

  constructor(private http: HttpClient) {}

  logView(userId: number, productId: number) {
    return this.http.post(`${this.apiUrl}/view`, {
      userID: userId,
      productID: productId
    });
  }

  logCart(userId: number, productId: number) {
    return this.http.post(`${this.apiUrl}/cart`, {
      userID: userId,
      productID: productId
    });
  }

  logPurchase(userId: number, productId: number) {
    return this.http.post(`${this.apiUrl}/purchase`, {
      userID: userId,
      productID: productId
    });
  }
}