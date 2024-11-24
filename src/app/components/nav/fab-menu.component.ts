import { animate, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import { Book } from '../../models/book.interface'

@Component({
  selector: 'app-fab-menu',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="fixed bottom-8 right-8 flex flex-col-reverse gap-4">
      <!-- Action buttons, shown when book is selected -->
      @if (selectedBook) {
        <div class="flex flex-col gap-2" @fadeInOut>
          <button mat-mini-fab color="warn" (click)="deleteBookEvent.emit(selectedBook)">
            <mat-icon>delete</mat-icon>
          </button>
          <button mat-mini-fab color="primary" (click)="editBookEvent.emit(selectedBook)">
            <mat-icon>edit</mat-icon>
          </button>
        </div>
      }

      <!-- Main FAB button -->
      <button mat-fab color="primary" (click)="addBookEvent.emit()">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class FabMenuComponent {
  @Input() selectedBook: Book | null = null;
  @Output() addBookEvent = new EventEmitter<void>();
  @Output() editBookEvent = new EventEmitter<Book>();
  @Output() deleteBookEvent = new EventEmitter<Book>();
}
