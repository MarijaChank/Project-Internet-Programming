import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';


type CartItem = {
  name: string;
  price: number | string;
  img: string;
};

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class Cart implements OnInit {
  cartData: CartItem[] = [];
  total = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    try {
      const raw = localStorage.getItem('petStoreCart');
      this.cartData = raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      this.cartData = [];
    }
    this.recalculateTotal();
  }

  private saveCart(): void {
    localStorage.setItem('petStoreCart', JSON.stringify(this.cartData));
    this.recalculateTotal();
  }

  private recalculateTotal(): void {
    this.total = this.cartData.reduce((sum, item) => {
      const priceNum = Number(item.price) || 0;
      return sum + priceNum;
    }, 0);
  }

  removeItem(item: CartItem): void {
    // remove only the first matching item (so duplicates are supported)
    const idx = this.cartData.findIndex(
      (i) => i.name === item.name && i.price === item.price && i.img === item.img
    );

    if (idx !== -1) {
      this.cartData.splice(idx, 1);
      this.saveCart();
    }
  }

  goToCheckout(): void {
    if (this.cartData.length === 0) return;

    // keep your old behavior too
    localStorage.setItem('petStoreCheckoutItems', JSON.stringify(this.cartData));

    // go to Angular checkout route
    this.router.navigateByUrl('/checkout');
  }
}
