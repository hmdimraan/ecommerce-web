import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterModule
} from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';
import { ActivityService } from '../../services/activity.service';

import { Product } from '../../models/product.model';
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
  allProducts: Product[] = [];
  recommendedProducts: Product[] = [];

  categories: any[] = [];

  searchText = '';
  selectedCategory = 0;

  currentPage = 1;
  pageSize = 6;

  constructor(
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private activityService: ActivityService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadProducts();

    this.loadCategories();

  }

  loadProducts(): void {

    this.currentPage = 1;

    this.productService
      .getProducts()
      .subscribe({

        next: (data: Product[]) => {

          this.products = data;

          this.allProducts = [...data];

          this.loadRecommendations();

        },

        error: err => {

          console.log(err);

          this.toastr.error('Failed to load products');

        }

      });

  }

  loadCategories(): void {

    this.categoryService
      .getCategories()
      .subscribe({

        next: res => {

          this.categories = res;

        },

        error: err => console.log(err)

      });

  }

  loadRecommendations(): void {

    const userId = Number(localStorage.getItem('userId'));

    if (!userId) {

      this.recommendedProducts = [];

      this.allProducts = [...this.products];

      return;

    }

    this.productService
      .getUserRecommendations(userId)
      .subscribe({

       next: (recommendations: any[]) => {

  this.recommendedProducts = recommendations
    .map(r => {

      const product = this.products.find(
        p => p.productID === r.productID
      );

      if (!product) return null;

      return {

        ...product,

        reason: r.reason,

        score: r.score

      } as Product;

    })
    .filter(
      (p): p is Product => p !== null
    );

  this.recommendedProducts =
    this.recommendedProducts.filter(
      (p, index, self) =>
        index ===
        self.findIndex(
          x => x.productID === p.productID
        )
    );

  this.allProducts =
    this.products.filter(
      p =>
        !this.recommendedProducts.some(
          r => r.productID === p.productID
        )
    );

  this.cdr.detectChanges();

},

        error: err => {

          console.log(err);

          this.recommendedProducts = [];

          this.allProducts = [...this.products];

        }

      });

  }

  viewProduct(productId: number): void {

    this.router.navigate(['/product', productId]);

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

          const userId = Number(localStorage.getItem('userId'));

          if (userId) {

            this.activityService
              .logCart(userId, product.productID)
              .subscribe({
                error: err => console.log(err)
              });

          }

        },

        error: err => {

          console.log(err);

          this.toastr.error(
            err.error || 'Failed To Add Product'
          );

        }

      });

  }

  filteredProducts(): Product[] {

    let filtered = [...this.allProducts];

    if (Number(this.selectedCategory) > 0) {

      filtered = filtered.filter(
        p => p.categoryID === Number(this.selectedCategory)
      );

    }

    if (this.searchText.trim()) {

      const search = this.searchText.toLowerCase();

      filtered = filtered.filter(
        p =>
          p.productName
            .toLowerCase()
            .includes(search)
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

    const total = Math.ceil(
      this.filteredProducts().length /
      this.pageSize
    );

    return total === 0 ? 1 : total;

  }

  nextPage(): void {

    if (this.currentPage < this.totalPages()) {

      this.currentPage++;

    }

  }

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

    }

  }

  getImageUrl(path: string): string {

    if (!path) {

      return 'assets/no-image.png';

    }

    if (path.startsWith('http')) {

      return path;

    }

    return this.environment.imageUrl + path;

  }

  onImageError(event: Event): void {

    const img =
      event.target as HTMLImageElement;

    img.src =
      'https://placehold.co/300x300?text=No+Image';

  }

}