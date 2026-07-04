import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})
export class EditProduct implements OnInit {
  environment = environment;
  api = environment.apiUrl;

  id = 0;

  isLoaded = false;

  product: any = {
    productName: '',
    price: 0,
    stock: 0,
    categoryID: 1,
    productImagePath: ''
  };

  selectedImage: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    this.id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadProduct();

  }

  loadProduct(): void {

    this.http
      .get<any[]>(`${this.api}/products`)
      .subscribe({

        next: (res) => {


          const p = res.find(
            x => Number(x.productID) === Number(this.id)
          );


          if (p) {

            this.product = {
              productName: p.productName,
              price: p.price,
              stock: p.stock,
              categoryID: p.categoryID,
              productImagePath: p.productImagePath
            };

          }

          this.isLoaded = true;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.log(err);

          this.isLoaded = true;

          this.toastr.error(
            'Failed To Load Product',
            'Error'
          );

        }

      });

  }

  onImageSelected(event: any): void {

    if (event.target.files.length > 0) {

      this.selectedImage = event.target.files[0];

    }

  }

  updateProduct(): void {

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

    if (this.selectedImage) {

      formData.append(
        'productImage',
        this.selectedImage
      );

    }

    this.http
      .put<any>(
        `${this.api}/products/${this.id}`,
        formData
      )
      .subscribe({

        next: () => {

          this.toastr.success(
            'Product Updated Successfully',
            'Success'
          );

          this.router.navigate(
            ['/admin-products']
          );

        },

        error: (err) => {

          console.log(err);

          this.toastr.error(
            err.error?.message || 'Failed To Update Product',
            'Error'
          );

        }

      });

  }

}