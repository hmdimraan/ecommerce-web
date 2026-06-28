import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { CheckoutService } from '../../services/checkout.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  environment = environment;
  cart: any[] = [];

  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cart = JSON.parse(
      localStorage.getItem('cart') || '[]'
    );
  }

  getTotal(): number {
    return this.cart.reduce(
      (sum: number, item: any) =>
        sum + item.price * item.quantity,
      0
    );
  }

  placeOrder(): void {

    const order = {
      totalAmount: this.getTotal(),

      items: this.cart.map(
        (x: any) => ({
          productID: x.productID,
          quantity: x.quantity,
          price: x.price
        })
      )
    };

    this.checkoutService
      .placeOrder(order)
      .subscribe({

        next: () => {

          this.toastr.success(
            'Order placed successfully'
          );

          localStorage.removeItem('cart');

          this.cart = [];

          this.router.navigate(
            ['/orders']
          );
        },

        error: (err) => {
          console.log(err);

          if (err.error) {
            this.toastr.error(
              err.error
            );
          }
          else {
            this.toastr.error(
              'Failed to place order'
            );
          }
        }
      });
  }
}