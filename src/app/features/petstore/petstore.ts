import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

type Category = 'pets' | 'accessories' | 'food';

type StoreItem = {
  name: string;
  category: Category;
  price: number;
  img: string;

  animal?: string;
  breed?: string;
  age?: string;
  gender?: string;

  type?: string;
  material?: string;
  color?: string;

  size?: string;
  flavor?: string;
};

@Component({
  selector: 'app-petstore',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './petstore.html',
  styleUrls: ['./petstore.css'],
})
export class Petstore implements OnInit, OnDestroy {
  data: StoreItem[] = [
    { name: 'Golden Retriever', category: 'pets', animal: 'Dog', breed: 'Golden Retriever', age: 'Young', gender: 'Male', price: 500, img: '/Photos&Videos/Golden-Retriver.jpg' },
    { name: 'Doberman', category: 'pets', animal: 'Dog', breed: 'Doberman', age: 'Young', gender: 'Male', price: 450, img: '/Photos&Videos/doberman.jpg' },

    { name: 'Persian Cat', category: 'pets', animal: 'Cat', breed: 'Persian', age: 'Adult', gender: 'Female', price: 350, img: '/Photos&Videos/Persian.jpg' },
    { name: 'Siamese Cat', category: 'pets', animal: 'Cat', breed: 'Siamese', age: 'Adult', gender: 'Female', price: 400, img: '/Photos&Videos/Siamese.jpg' },

    { name: 'Holland Lop', category: 'pets', animal: 'Bunny', breed: 'Holland Lop', age: 'Young', gender: 'Male', price: 500, img: '/Photos&Videos/HollandLop.jpg' },

    { name: 'Dog Leash', category: 'accessories', animal: 'Dog', type: 'Leash', material: 'Leather', color: 'Brown', price: 25, img: '/Photos&Videos/dogleash.jpg' },
    { name: 'Cat Toy', category: 'accessories', animal: 'Cat', type: 'Toy', material: 'Plastic', color: 'Red', price: 15, img: '/Photos&Videos/cattoy.jpg' },
    { name: 'Dog Collar', category: 'accessories', animal: 'Dog', type: 'Collar', material: 'Fabric', color: 'Blue', price: 20, img: '/Photos&Videos/dogcollar.jpg' },
    { name: 'Cat Bed', category: 'accessories', animal: 'Cat', type: 'Bed', material: 'Fabric', color: 'Green', price: 50, img: '/Photos&Videos/catbed.jpg' },
    { name: 'Dog Bed', category: 'accessories', animal: 'Dog', type: 'Bed', material: 'Fabric', color: 'Brown', price: 60, img: '/Photos&Videos/dogbed.jpg' },
    { name: 'Cat Collar', category: 'accessories', animal: 'Cat', type: 'Collar', material: 'Leather', color: 'Red', price: 18, img: '/Photos&Videos/catcollar.jpg' },

    { name: 'Dog Food Dry', category: 'food', animal: 'Dog', type: 'Dry', size: 'Large', flavor: 'Chicken', price: 40, img: '/Photos&Videos/dogfooddry.jpg' },
    { name: 'Cat Food Wet', category: 'food', animal: 'Cat', type: 'Wet', size: 'Small', flavor: 'Fish', price: 30, img: '/Photos&Videos/catwetfood.jpg' },
    { name: 'Dog Snack', category: 'food', animal: 'Dog', type: 'Dry', size: 'Medium', flavor: 'Beef', price: 15, img: '/Photos&Videos/dogsnack.jpg' },
    { name: 'Cat Treat', category: 'food', animal: 'Cat', type: 'Wet', size: 'Small', flavor: 'Chicken', price: 12, img: '/Photos&Videos/catsnack.jpg' },
  ];

  currentCategory: Category = 'pets';
  search = '';

  petAnimal = '';
  petBreed = '';
  petAge = '';
  petGender = '';
  petPriceSort: '' | 'low' | 'high' = '';

  accAnimal = '';
  accType = '';
  accMaterial = '';
  accColor = '';

  foodAnimal = '';
  foodType = '';
  foodSize = '';
  foodFlavor = '';

  cartCount = 0;

  toastVisible = false;
  toastTimer: any = null;

  modalOpen = false;
  activeModalItem: StoreItem | null = null;
  recommendedHeading = 'Recommended for your pet';
  recommended: StoreItem[] = [];
  selectedRecommendedNames = new Set<string>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.syncCartCount();
    this.showPaymentToastIfNeeded();

    window.addEventListener('focus', this.syncCartCount);
    window.addEventListener('storage', this.syncCartCount);
  }

  ngOnDestroy(): void {
    window.removeEventListener('focus', this.syncCartCount);
    window.removeEventListener('storage', this.syncCartCount);
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  syncCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('petStoreCart') || '[]');
      this.cartCount = Array.isArray(cart) ? cart.length : 0;
    } catch {
      this.cartCount = 0;
    }
  };

  showPaymentToastIfNeeded(): void {
    const status = localStorage.getItem('petStorePaymentStatus');
    if (status === 'success') {
      this.toastVisible = true;
      localStorage.removeItem('petStorePaymentStatus');

      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => (this.toastVisible = false), 3000);
    }
  }

  setCategory(cat: Category): void {
    this.currentCategory = cat;
    this.search = '';
    this.clearFilters();
  }

  clearFilters(): void {
    this.petAnimal = '';
    this.petBreed = '';
    this.petAge = '';
    this.petGender = '';
    this.petPriceSort = '';

    this.accAnimal = '';
    this.accType = '';
    this.accMaterial = '';
    this.accColor = '';

    this.foodAnimal = '';
    this.foodType = '';
    this.foodSize = '';
    this.foodFlavor = '';
  }

  get filteredItems(): StoreItem[] {
    let items = this.data.filter((i) => i.category === this.currentCategory);

    const search = this.search.trim().toLowerCase();
    if (search) items = items.filter((i) => i.name.toLowerCase().includes(search));

    if (this.currentCategory === 'pets') {
      if (this.petAnimal) items = items.filter((i) => i.animal === this.petAnimal);
      if (this.petBreed) items = items.filter((i) => i.breed === this.petBreed);
      if (this.petAge) items = items.filter((i) => i.age === this.petAge);
      if (this.petGender) items = items.filter((i) => i.gender === this.petGender);

      if (this.petPriceSort === 'low') items = [...items].sort((a, b) => a.price - b.price);
      if (this.petPriceSort === 'high') items = [...items].sort((a, b) => b.price - a.price);
    }

    if (this.currentCategory === 'accessories') {
      if (this.accAnimal) items = items.filter((i) => i.animal === this.accAnimal);
      if (this.accType) items = items.filter((i) => i.type === this.accType);
      if (this.accMaterial) items = items.filter((i) => i.material === this.accMaterial);
      if (this.accColor) items = items.filter((i) => i.color === this.accColor);
    }

    if (this.currentCategory === 'food') {
      if (this.foodAnimal) items = items.filter((i) => i.animal === this.foodAnimal);
      if (this.foodType) items = items.filter((i) => i.type === this.foodType);
      if (this.foodSize) items = items.filter((i) => i.size === this.foodSize);
      if (this.foodFlavor) items = items.filter((i) => i.flavor === this.foodFlavor);
    }

    return items;
  }

  openModal(item: StoreItem): void {
    this.activeModalItem = item;
    this.modalOpen = true;

    this.selectedRecommendedNames.clear();

    if (item.category === 'pets') {
      this.recommendedHeading = 'Recommended for your pet';
      this.recommended = this.data
        .filter((d) => d.category !== 'pets' && d.animal === item.animal)
        .slice(0, 4);
    } else {
      this.recommendedHeading = 'Recommended';
      this.recommended = this.data
        .filter((d) => d.category === item.category && d.name !== item.name)
        .slice(0, 4);
    }
  }

  closeModal(): void {
    this.modalOpen = false;
    this.activeModalItem = null;
    this.recommended = [];
    this.selectedRecommendedNames.clear();
  }

  toggleRecommended(item: StoreItem): void {
    if (this.selectedRecommendedNames.has(item.name)) this.selectedRecommendedNames.delete(item.name);
    else this.selectedRecommendedNames.add(item.name);
  }

  isRecommendedSelected(item: StoreItem): boolean {
    return this.selectedRecommendedNames.has(item.name);
  }

  private getSelectedRecommendedItems(): StoreItem[] {
    const selected = [...this.selectedRecommendedNames];
    return selected.map((n) => this.data.find((d) => d.name === n)).filter(Boolean) as StoreItem[];
  }

  addToCart(): void {
    const base = this.activeModalItem;
    if (!base) return;

    const selectedRec = this.getSelectedRecommendedItems();

    let cart: StoreItem[] = [];
    try {
      cart = JSON.parse(localStorage.getItem('petStoreCart') || '[]');
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }

    const pushUnique = (it: StoreItem) => {
      if (!cart.some((c) => c.name === it.name)) cart.push(it);
    };

    pushUnique(base);
    selectedRec.forEach(pushUnique);

    localStorage.setItem('petStoreCart', JSON.stringify(cart));
    this.syncCartCount();

    alert(`${base.name} + ${selectedRec.length} recommended item(s) added to cart!`);
  }

  goToCart(): void {
    this.router.navigateByUrl('/cart');
  }

  buyNow(): void {
    const base = this.activeModalItem;
    if (!base) return;

    const selectedRec = this.getSelectedRecommendedItems();
    const list = [base, ...selectedRec];

    const unique: StoreItem[] = [];
    const seen = new Set<string>();
    list.forEach((it) => {
      if (!seen.has(it.name)) {
        seen.add(it.name);
        unique.push(it);
      }
    });

    localStorage.setItem('petStoreCheckoutItems', JSON.stringify(unique));
    localStorage.setItem('petStoreCheckoutItem', JSON.stringify(base));

    this.router.navigateByUrl('/checkout');
  }

  careBook(): void {
    const item = this.activeModalItem;
    if (!item) return;

    const content =
      `Care guide for ${item.name}\n\n` +
      `- Feed twice a day\n` +
      `- Play 1 hour daily\n` +
      `- Regular vet checkup\n` +
      `- Groom weekly\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${item.name}_CareBook.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
