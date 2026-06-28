import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';
import { ChangeDetectorRef } from '@angular/core';
import { Product } from '../../models/product.model';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  environment = environment;
  products: Product[] = [];
  categories: any[] = [];

  searchText = '';
  selectedCategory = 0;

  currentPage = 1;
  pageSize = 6;

constructor(
  private productService: ProductService,
  private cartService: CartService,
  private toastr: ToastrService,
  private categoryService: CategoryService,
  private router: Router,
  private cdr: ChangeDetectorRef
) {

  this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe(() => {

      if (this.router.url === '/products') {

        this.loadProducts();

      }

    });

}

  ngOnInit(): void {
     console.log('Products ngOnInit');
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {

  this.currentPage = 1;

  this.selectedCategory = 0;

  this.searchText = '';

  this.productService
    .getProducts()
    .subscribe({

     next: (data: Product[]) => {

  this.products = data;
      console.log('Loaded Products:', this.products.length);
  this.cdr.detectChanges();

},
      error: (err) => {

        console.log(err);

        this.toastr.error('Failed to load products');

      }

    });

}

  loadCategories(): void {

    this.categoryService.getCategories().subscribe({

      next: (res) => {

        this.categories = res;

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  addToCart(product: Product): void {

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

  filteredProducts(): Product[] {

  let filtered = [...this.products];

  if (Number(this.selectedCategory) > 0) {

    filtered = filtered.filter(

      p => p.categoryID === Number(this.selectedCategory)

    );

  }

  if (this.searchText.trim()) {

    filtered = filtered.filter(

      p =>
        p.productName
          .toLowerCase()
          .includes(
            this.searchText.toLowerCase()
          )

    );

  }

  return filtered;

}

  paginatedProducts(): Product[] {

    const filtered = this.filteredProducts();

    const start =
      (this.currentPage - 1) * this.pageSize;

    return filtered.slice(
      start,
      start + this.pageSize
    );

  }

  totalPages(): number {

    return Math.ceil(

      this.filteredProducts().length /

      this.pageSize

    );

  }

  nextPage(): void {

    if (

      this.currentPage < this.totalPages()

    ) {

      this.currentPage++;

    }

  }

  previousPage(): void {

    if (

      this.currentPage > 1

    ) {

      this.currentPage--;

    }

  }

}