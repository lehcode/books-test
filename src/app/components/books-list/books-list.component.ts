import { animate, query, stagger, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { Store } from '@ngrx/store'

import { Book } from '../../models/book.interface'
import { deleteBook, loadBooks } from '../../store/actions/books.actions'
import { selectBooksError, selectBooksLoading, selectFilteredBooks } from '../../store/selectors/books.selectors'
import { BookDetailsComponent } from '../book-details/book-details.component'
import { BookSearchComponent } from '../book-search/book-search.component'
import { BookFormComponent } from '../dialogs/book-form.component'
import { DeleteBookDialogComponent } from '../dialogs/delete-book.component'
import { FabMenuComponent } from '../nav/fab-menu.component'

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    FabMenuComponent,
    BookSearchComponent,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <!-- Header Section -->
      <div class="bg-white dark:bg-gray-800 shadow-sm">
        <div class="container mx-auto px-4 py-6">
          <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-6">{{ title }}</h1>
          <app-book-search></app-book-search>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container mx-auto px-4 py-8">
        <!-- Loading State -->
        <div class="flex justify-center p-8" *ngIf="loading$ | async">
          <mat-spinner></mat-spinner>
        </div>

        <!-- Error State -->
        <div
          class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6"
          *ngIf="error$ | async as error"
        >
          {{ error }}
        </div>

        <!-- Books Grid -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          *ngIf="(loading$ | async) === false"
          [@staggerAnimation]="(books$ | async)?.length"
        >
          <div
            *ngFor="let book of (books$ | async); let i = index"
            class="group relative"
            [@cardAnimation]
          >
            <!-- Book Card -->
            <div
              class="book-card relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out"
              [class.selected]="selectedBook?.id === book.id"
              (click)="selectBook(book)"
              (keyup.enter)="selectBook(book)"
              tabindex=i
            >
              <!-- Cover Image with Overlay -->
              <div class="relative aspect-[3/4] overflow-hidden">
                <img
                  [src]="book.cover"
                  [alt]="book.title"
                  class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <!-- Content -->
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                  {{ book.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 mb-2">
                  {{ book.author.firstName }} {{ book.author.lastName }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Published: {{ book.published }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  mat-mini-fab
                  color="primary"
                  class="!w-10 !h-10 shadow-lg"
                  (click)="openDetails(book, $event)">
                  <mat-icon>info</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          class="text-center py-16"
          *ngIf="(loading$ | async) === false && (books$ | async)?.length === 0"
          @fadeAnimation
        >
          <mat-icon class="text-6xl text-gray-400 dark:text-gray-600 mb-4">library_books</mat-icon>
          <p class="text-xl text-gray-600 dark:text-gray-300">No books found</p>
        </div>

        <!-- FAB Menu -->
        <app-fab-menu
          [selectedBook]="selectedBook"
          (addBookEvent)="openAddBookDialog()"
          (editBookEvent)="openEditDialog($event)"
          (deleteBookEvent)="openDeleteDialog($event)">
        </app-fab-menu>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .book-card {
      transform: translateY(0);
      will-change: transform;
    }

    .book-card:hover {
      transform: translateY(-8px);
    }

    .book-card.selected {
      @apply ring-2 ring-offset-2;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    ::ng-deep .mat-mdc-mini-fab {
      transform: scale(0.9);
      transition: transform 0.2s ease;
    }

    ::ng-deep .mat-mdc-mini-fab:hover {
      transform: scale(1);
    }
  `],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger('100ms', [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class BooksListComponent {
  books$ = this.store.select(selectFilteredBooks)
  loading$ = this.store.select(selectBooksLoading)
  error$ = this.store.select(selectBooksError)

  title = 'Library'
  selectedBook: Book | null = null

  constructor(
    private store: Store,
    private dialog: MatDialog,
  ) {
    this.store.dispatch(loadBooks())
  }

  selectBook(book: Book): void {
    this.selectedBook = this.selectedBook?.id === book.id ? null : book
  }

  openAddBookDialog(): void {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '500px',
      disableClose: true,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(loadBooks())
      }
    })
  }

  openEditDialog(book: Book): void {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '500px',
      data: { book },
      disableClose: true,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(loadBooks())
        this.selectedBook = null
      }
    })
  }

  openDetails(book: Book, event: Event): void {
    event.stopPropagation()
    this.dialog.open(BookDetailsComponent, {
      data: { book },
      width: '500px',
    })
  }

  openDeleteDialog(book: Book): void {
    const dialogRef = this.dialog.open(DeleteBookDialogComponent, {
      data: { book },
      width: '400px',
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(deleteBook({ id: book.id }))
        this.selectedBook = null
      }
    })
  }
}
