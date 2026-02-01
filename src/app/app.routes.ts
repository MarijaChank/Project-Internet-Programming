import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'petstore', pathMatch: 'full' },

  {
    path: 'petstore',
    loadComponent: () =>
      import('./features/petstore/petstore').then((m) => m.Petstore),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart').then((m) => m.Cart),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout').then((m) => m.Checkout),
  },


  { path: '**', redirectTo: 'petstore' },
];
