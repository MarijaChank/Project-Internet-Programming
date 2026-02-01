import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
})
export class Contact {
  submitted = false;
  toastText = "🐾 Thank you! Your message has been sent successfully.";
  private toastTimer: any = null;

  submit(form: NgForm) {
    if (form.invalid) return;

    this.submitted = true;

    // auto-hide after 4s (like your contact one)
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.submitted = false;
    }, 4000);

    form.resetForm();
  }

  resetToast() {
    this.submitted = false;
    clearTimeout(this.toastTimer);
  }
}
