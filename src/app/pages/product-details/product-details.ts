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
import { ActivityService } from '../../services/activity.service';
import { Router } from '@angular/router';


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
  recommendedProducts: any[] = [];
  product: any = null;

  reviews: any[] = [];
  
  newReview = {
    rating: 5,
    comment: ''
  };

constructor(
  private router: Router,
  private route: ActivatedRoute,
  private http: HttpClient,
  private cartService: CartService,
  private toastr: ToastrService,
  private cdr: ChangeDetectorRef,
  private activityService: ActivityService
) {}
ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

        const id = Number(params.get('id'));

        this.loadProduct(id);

    });

}

  loadProduct(id: number): void {

    this.http
      .get<any[]>(`${this.api}/products`)
      .subscribe({

       next: (res) => {

  this.product = res.find(
    p => p.productID === id
  );


  const userId = Number(localStorage.getItem('userId'));

  if (userId && this.product) {

    this.activityService
      .logView(userId, this.product.productID)
      .subscribe({
        next: () => console.log("View logged"),
        error: (err: any) => console.log(err)
      });

  }

  this.cdr.detectChanges();

  this.loadReviews(id);
  this.loadRecommendations(id);

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
  viewProduct(productId: number): void {

  this.router.navigate(['/product', productId]);

}
  loadRecommendations(productId: number): void {

  this.http
    .get<any[]>(`${this.api}/recommend/${productId}`)
    .subscribe({

      next: (res) => {

        console.log(res);
        this.recommendedProducts = res;

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

  const userId = Number(localStorage.getItem('userId'));

  if (userId) {

    this.activityService
      .logCart(userId, product.productID)
      .subscribe({
        next: () => console.log("Cart activity logged"),
        error: (err: any) => console.log(err)
      });

  }

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