import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

type CartItem = {
  name: string;
  price: number | string;
  img?: string;
};

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
})
export class Checkout implements OnInit {
  checkoutItems: CartItem[] = [];
  total = 0;

  toastVisible = false;

  // Billing form fields
  fullName = '';
  email = '';
  phone = '';
  country = '';
  address = '';

  paymentMethod: 'card' | 'paypal' | 'cash' = 'card';
  cardName = '';
  cardNumber = '';
  exp = '';
  cvv = '';
  zip = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadItems();
  }

  private loadItems(): void {
    let items: CartItem[] = [];

    try {
      items = JSON.parse(localStorage.getItem('petStoreCheckoutItems') || '[]');
    } catch {
      items = [];
    }

    if (!Array.isArray(items) || items.length === 0) {
      try {
        items = JSON.parse(localStorage.getItem('petStoreCart') || '[]');
      } catch {
        items = [];
      }
    }

    this.checkoutItems = Array.isArray(items) ? items : [];
    this.total = this.checkoutItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }

  pay(): void {
    // Required fields check (same logic as your JS)
    const missing =
      !this.fullName.trim() ||
      !this.email.trim() ||
      !this.phone.trim() ||
      !this.country.trim() ||
      !this.address.trim();

    if (missing) {
      alert('Please fill in billing details.');
      return;
    }

    // Show toast + clear localStorage like your JS
    this.toastVisible = true;

    localStorage.setItem('petStorePaymentStatus', 'success');
    localStorage.removeItem('petStoreCart');
    localStorage.removeItem('petStoreCheckoutItems');
    localStorage.removeItem('petStoreCheckoutItem');

    setTimeout(() => {
      this.router.navigateByUrl('/petstore');
    }, 1200);
  }
}
