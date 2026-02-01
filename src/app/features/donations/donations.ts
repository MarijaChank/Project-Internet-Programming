import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './donations.html',
  styleUrls: ['./donations.css'],
})
export class Donations {
  // Toast
  submitted = false;

  // Tabs
  activeTab: 'money' | 'goods' = 'money';

  // Inputs
  donorName = '';
  address = '';
  phone = '';
  email = '';

  paymentMethod = '';
  currency: 'MKD' | 'EUR' | 'USD' = 'MKD';
  amount = 1000;

  goodsNote = '';

  // Multi-select (we’ll wire checkboxes into arrays)
  goodsItems: string[] = [];
  goodsAnimals: string[] = [];

  formatNumber(n: number) {
    return Number(n).toLocaleString('en-US');
  }

  setActiveTab(tab: 'money' | 'goods') {
    this.activeTab = tab;
  }

  resetToast() {
    this.submitted = false;
  }

  toggleSelection(list: string[], value: string) {
    const idx = list.indexOf(value);
    if (idx >= 0) list.splice(idx, 1);
    else list.push(value);
  }

  submit() {
    // Payment mode validation
    if (this.activeTab === 'money') {
      if (!this.paymentMethod.trim()) {
        alert('Please select a payment method 🧾');
        return;
      }

      // show toast
      this.submitted = true;

      // optional auto-hide
      setTimeout(() => (this.submitted = false), 3500);
    } else {
      // goods mode
      this.submitted = true;
      setTimeout(() => (this.submitted = false), 3500);
    }

    // reset fields (keep currency + amount defaults nice)
    this.donorName = '';
    this.address = '';
    this.phone = '';
    this.email = '';
    this.paymentMethod = '';
    this.currency = 'MKD';
    this.amount = 1000;
    this.goodsNote = '';
    this.goodsItems = [];
    this.goodsAnimals = [];

    this.activeTab = 'money';
  }
}
