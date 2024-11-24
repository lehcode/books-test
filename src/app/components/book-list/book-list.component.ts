import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTableModule } from '@angular/material/table'
import { Store } from '@ngrx/store'

import { fadeInOut } from '../../animations/fade-in-out'
import { Book } from '../../models/book.interface'
import { deleteBook, loadBooks } from '../../store/actions/books.actions'
import { selectBooksError, selectBooksLoading, selectFilteredBooks } from '../../store/selectors/books.selectors'
import { BookDetailsComponent } from '../book-details/book-details.component'
import { BookSearchComponent } from '../book-search/book-search.component'
import { BookFormComponent } from '../dialogs/add-book.component'
import { DeleteBookDialogComponent } from '../dialogs/delete-book.component'
import { FabMenuComponent } from '../nav/fab-menu.component'

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    FabMenuComponent,
    BookSearchComponent,
  ],
  template: `
    <div class="container mx-auto p-4 relative min-h-screen">
      <h1 class="text-2xl font-bold mb-6">{{ title }}</h1>

      <!-- Search Component -->
      <app-book-search></app-book-search>

      <!-- Loading Spinner -->
      <div class="flex justify-center p-4" *ngIf="loading$ | async">
        <mat-spinner></mat-spinner>
      </div>

      <!-- Error Message -->
      <div class="text-red-600 p-4" *ngIf="error$ | async as error">
        {{ error }}
      </div>

      <!-- Books Table -->
      <mat-table [dataSource]="(books$ | async) ?? []" *ngIf="(loading$ | async) === false">
        <!-- Title Column -->
        <ng-container matColumnDef="title">
          <mat-header-cell *matHeaderCellDef>Title</mat-header-cell>
          <mat-cell *matCellDef="let book">{{ book.title }}</mat-cell>
        </ng-container>

        <!-- Author Column -->
        <ng-container matColumnDef="author">
          <mat-header-cell *matHeaderCellDef>Author</mat-header-cell>
          <mat-cell *matCellDef="let book">
            {{ book.author.firstName }} {{ book.author.lastName }}
          </mat-cell>
        </ng-container>

        <!-- Published Column -->
        <ng-container matColumnDef="published">
          <mat-header-cell *matHeaderCellDef>Year</mat-header-cell>
          <mat-cell *matCellDef="let book">{{ book.published }}</mat-cell>
        </ng-container>

        <!-- Info Column -->
        <ng-container matColumnDef="info">
          <mat-header-cell *matHeaderCellDef></mat-header-cell>
          <mat-cell *matCellDef="let book">
            <button mat-icon-button (click)="openDetails(book, $event)" color="primary">
              <mat-icon>info</mat-icon>
            </button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row
          *matRowDef="let book; columns: displayedColumns"
          [class.selected-row]="selectedBook?.id === book.id"
          (click)="selectBook(book)"
        ></mat-row>
      </mat-table>

      <!-- No Results Message -->
      <div
        class="text-center p-8"
        *ngIf="(loading$ | async) === false && (books$ | async)?.length === 0"
        @fadeInOut
      >
        No books found.
      </div>

      <!-- FAB Menu -->
      <app-fab-menu
        [selectedBook]="selectedBook"
        (onAdd)="openAddBookDialog()"
        (onEdit)="openEditDialog($event)"
        (onDelete)="openDeleteDialog($event)"
      ></app-fab-menu>
    </div>
  `,
  styleUrls: ['./book-list.component.css'],
  animations: [fadeInOut],
})
export class BookListComponent {
  books$ = this.store.select(selectFilteredBooks)
  loading$ = this.store.select(selectBooksLoading)
  error$ = this.store.select(selectBooksError)

  displayedColumns = ['title', 'author', 'published', 'info']
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
