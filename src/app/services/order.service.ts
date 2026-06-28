import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.api}/orders/my-orders`
    );
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.api}/orders/all`
    );
  }

  cancelOrder(id: number): Observable<any> {
    return this.http.put(
      `${this.api}/orders/cancel/${id}`,
      {}
    );
  }

  updateStatus(
    id: number,
    status: string
  ): Observable<any> {
    return this.http.put(
      `${this.api}/orders/${id}/status?status=${status}`,
      {}
    );
  }
}