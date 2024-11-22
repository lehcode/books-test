import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
import { Router } from '@angular/router'


@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <mat-card class="w-full max-w-lg transform transition-all duration-300 hover:shadow-xl">
      <mat-card-content class="p-8">
        <!-- Error Icon -->
        <div class="flex justify-center mb-8">
            <mat-icon
              class="transform scale-[3] text-red-500 animate-bounce"
              [ngClass]="{'animate-bounce': isAnimating}"
              (mouseenter)="startAnimation()"
              (mouseleave)="stopAnimation()">
              error_outline
            </mat-icon>
        </div>

        <div class="space-y-4 text-center">
            <h1 class="text-8xl font-light text-red-500 mb-4">404</h1>
            <h2 class="text-3xl font-light text-gray-800 mb-4">Page Not Found</h2>

            <p class="text-lg text-gray-600 mb-8">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                mat-raised-button
                color="primary"
                class="w-full sm:w-auto px-6 py-2 transition-all duration-300 hover:scale-105"
                (click)="goHome()">
                <mat-icon class="mr-2">home</mat-icon>
                Return to Home
              </button>

              <button
                mat-stroked-button
                color="accent"
                class="w-full sm:w-auto px-6 py-2 transition-all duration-300 hover:scale-105"
                (click)="goBack()">
                <mat-icon class="mr-2">arrow_back</mat-icon>
                Go Back
              </button>
            </div>
          </div>
      </mat-card-content>
    </mat-card>
  </div>
  `,
  styles: ``,
})

export class NotFoundComponent {
  isAnimating = false;

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    window.history.back();
  }

  startAnimation() {
    this.isAnimating = true;
  }

  stopAnimation() {
    this.isAnimating = false;
  }
}
