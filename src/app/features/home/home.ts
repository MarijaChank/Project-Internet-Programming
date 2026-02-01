import { Component, AfterViewInit, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})

export class Home implements AfterViewInit {

  cartCount = 0;
  dropdownOpen = false;
  headerSolid = false;


  constructor(private router: Router) {}
 
  private updateHeaderSolid(): void {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const heroBottom = hero.getBoundingClientRect().bottom;
  this.headerSolid = heroBottom <= 90;
}

ngAfterViewInit(): void {
  this.updateHeaderSolid();
}

@HostListener('window:scroll')
onScroll(): void {
  this.updateHeaderSolid();
}

@HostListener('window:resize')
onResize(): void {
  this.updateHeaderSolid();
}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  goToPetstore(category: string, animal: string) {
    this.router.navigate(['/petstore'], {
      queryParams: { category, animal }
    });
  }
}
