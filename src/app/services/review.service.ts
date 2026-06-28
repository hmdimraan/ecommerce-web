import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getReviews(productId: number) {
    return this.http.get(
      `${this.apiUrl}/reviews/product/${productId}`
    );
  }

  addReview(review: any) {
    return this.http.post(
      `${this.apiUrl}/reviews`,
      review
    );
  }
}