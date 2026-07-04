import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { AdminProducts } from './pages/admin-products/admin-products';
import { withComponentInputBinding } from '@angular/router';
import { EditProduct } from './pages/edit-product/edit-product';
import { AddProduct } from './pages/add-product/add-product';
import { ProductDetails } from './pages/product-details/product-details';


export const routes: Routes = [

  // 🔥 Default route
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // 🔐 Login
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then(m => m.Login)
  },

  // 📝 Register
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register')
        .then(m => m.Register)
  },


{
  path: 'dashboard',
  loadComponent: () =>
    import('./pages/dashboard/dashboard')
      .then(m => m.Dashboard),
  canActivate: [adminGuard]
},

  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products')
        .then(m => m.Products),
    canActivate: [authGuard]
  },


  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart')
        .then(m => m.Cart),
    canActivate: [authGuard]
  },

  
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout')
        .then(m => m.Checkout),
    canActivate: [authGuard]
  },

 
  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders/orders')
        .then(m => m.Orders),
    canActivate: [authGuard]
  },

  
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin')
        .then(m => m.Admin),
    canActivate: [authGuard, adminGuard]   
  },

 {
  path: 'admin-products',
  loadComponent: () =>
    import('./pages/admin-products/admin-products')
      .then(m => m.AdminProducts),
  canActivate: [adminGuard]
},
{
  path: 'edit-product/:id',
  loadComponent: () =>
    import('./pages/edit-product/edit-product')
      .then(m => m.EditProduct),
  canActivate: [adminGuard]
},
{
  path: 'add-product',
  loadComponent: () =>
    import('./pages/add-product/add-product')
      .then(m => m.AddProduct),
  canActivate: [adminGuard]
},
{
  path: 'product/:id',
  component: ProductDetails,
  canActivate: [authGuard]
},

  {
    path: '**',
    redirectTo: 'login'
  }

];