import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProducts implements OnInit {
  environment = environment;
  api = environment.apiUrl;

  products: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    console.log('ADMIN PRODUCTS LOADED');
    console.log(this.api);

    this.loadProducts();

  }

  loadProducts(): void {

    this.http
      .get<any[]>(`${this.api}/products`)
      .subscribe({

        next: (res) => {

          console.log('API RESPONSE:', res);

          this.products = res;

          console.log('PRODUCTS:', this.products);

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  deleteProduct(id: number): void {

    this.http
      .delete(`${this.api}/products/${id}`)
      .subscribe({

        next: () => {

          this.loadProducts();

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

}