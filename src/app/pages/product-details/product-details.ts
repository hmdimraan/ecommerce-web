import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { ReviewService } from '../../services/review.service';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  environment = environment;
  api = environment.apiUrl;

  product: any = null;

  reviews: any[] = [];

  newReview = {
    rating: 5,
    comment: ''
  };

constructor(
  private route: ActivatedRoute,
  private http: HttpClient,
  private cartService: CartService,
  private toastr: ToastrService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadProduct(id);

  }

  loadProduct(id: number): void {

    this.http
      .get<any[]>(`${this.api}/products`)
      .subscribe({

        next: (res) => {

          this.product =
            res.find(
              p => p.productID === id
            );

          this.cdr.detectChanges();

          this.loadReviews(id);

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  loadReviews(productId: number): void {

    console.log('Loading reviews for', productId);

    this.http
      .get<any[]>(`${this.api}/reviews/${productId}`)
      .subscribe({

        next: (res) => {

          console.log('Reviews:', res);

          this.reviews = res;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  addReview(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    const review = {

      productID: id,

      userID: 1,

      rating: this.newReview.rating,

      comment: this.newReview.comment

    };

    this.http
      .post(
        `${this.api}/reviews`,
        review
      )
      .subscribe({

        next: () => {

          this.newReview = {
            rating: 5,
            comment: ''
          };

          this.loadReviews(id);

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.log(err);

        }

      });

  }
  addToCart(product: any): void {

  if (product.stock <= 0) {

    this.toastr.error('Product Out Of Stock');

    return;

  }

  this.cartService
    .addToCart(product.productID, 1)
    .subscribe({

      next: () => {

        this.toastr.success('Product Added To Cart');

      },

      error: (err) => {

        console.log(err);

        this.toastr.error(
          err.error || 'Failed To Add Product'
        );

      }

    });

}
}