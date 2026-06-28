import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct {

  api = environment.apiUrl;

  product: any = {
    productName: '',
    price: 0,
    stock: 0,
    categoryID: 1
  };

  imageFile: File | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onFileSelected(event: any): void {

    this.imageFile = event.target.files[0];

  }

  addProduct(): void {

    const formData = new FormData();

    formData.append(
      'productName',
      this.product.productName
    );

    formData.append(
      'price',
      this.product.price
    );

    formData.append(
      'stock',
      this.product.stock
    );

    formData.append(
      'categoryID',
      this.product.categoryID
    );

    if (this.imageFile) {

      formData.append(
        'image',
        this.imageFile
      );

    }

    this.http
      .post<any>(
        `${this.api}/products`,
        formData
      )
      .subscribe({

        next: () => {

          this.toastr.success(
            'Product Added Successfully',
            'Success'
          );

          this.router.navigate(
            ['/admin-products']
          );

        },

        error: (err) => {

          console.log(err);

          this.toastr.error(
            err.error?.message || 'Failed To Add Product',
            'Error'
          );

        }

      });

  }

}