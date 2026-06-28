import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  environment = environment;
  cart: any[] = [];

  constructor(
  private cartService: CartService,
  private router: Router,
  private cdr: ChangeDetectorRef
) { }
  ngOnInit(): void {
    console.log('Cart ngOnInit');

    this.loadCart();
  }

 loadCart(): void {

  this.cartService
    .getCart()
    .subscribe({

      next: (res: any) => {

        this.cart = [...(res.items ?? [])];
        
          this.cdr.detectChanges();

      },

      error: (err) => {

        console.log(err);

      }

    });

}

 increaseQuantity(item: any): void {

  const scrollPosition = window.scrollY;

  this.cartService
    .updateQuantity(
      item.productID,
      item.quantity + 1
    )
    .subscribe({

      next: () => {

        this.loadCart();

        setTimeout(() => {
          window.scrollTo({
            top: scrollPosition,
            behavior: 'instant' as ScrollBehavior
          });
        }, 0);

      },

      error: (err) => {
        console.log(err);
      }

    });
}

  decreaseQuantity(item: any): void {

  if (item.quantity <= 1) {
    return;
  }

  const scrollPosition = window.scrollY;

  this.cartService
    .updateQuantity(
      item.productID,
      item.quantity - 1
    )
    .subscribe({

      next: () => {

        this.loadCart();

        setTimeout(() => {
          window.scrollTo({
            top: scrollPosition,
            behavior: 'instant' as ScrollBehavior
          });
        }, 0);

      },

      error: (err) => {
        console.log(err);
      }

    });
}
  
removeItem(item: any): void {

  this.cartService
    .removeItem(item.productID)
    .subscribe({

      next: () => {

        this.cart = this.cart.filter(
          x => x.productID !== item.productID
        );

        this.cart = [...this.cart];

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.log(err);

      }

    });

}

clearCart(): void {

  this.cartService
    .clearCart()
    .subscribe({

      next: () => {

        this.loadCart();

      },

      error: (err) => {

        console.log(err);

      }

    });

}
  getTotal(): number {

    return this.cart.reduce(
      (sum: number, item: any) =>
        sum + item.price * item.quantity,
      0
    );
  }

  goToCheckout(): void {

    localStorage.setItem(
      'cart',
      JSON.stringify(this.cart)
    );

    this.router.navigate(
      ['/checkout']
    );
  }
  trackByProductId(index: number, item: any): number {
  return item.productID;
}
}