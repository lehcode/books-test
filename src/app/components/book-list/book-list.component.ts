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
import { selectBooks, selectBooksError, selectBooksLoading } from '../../store/selectors/books.selectors'
import { BookDetailsComponent } from '../book-details/book-details.component'
import { DeleteBookDialogComponent } from '../dialogs/delete-book.component'

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
  template: `
    <h1 class="text-2xl font-bold mb-4">{{ title }}</h1>
    <div class="container mx-auto p-4">
      <!-- Loading State -->
      <div *ngIf="loading$ | async" class="flex justify-center p-4">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Error State -->
      <div *ngIf="error$ | async as error" class="text-red-600 p-4">
        {{ error }}
      </div>

      <!-- Data Table -->
      <mat-table
        *ngIf="!(loading$ | async) && (books$ | async)?.length"
        [dataSource]="(books$ | async) ?? []"
        @fadeInOut
      >
        <!-- Existing columns remain the same -->
        <ng-container matColumnDef="title">
          <mat-header-cell *matHeaderCellDef>Title</mat-header-cell>
          <mat-cell *matCellDef="let book">{{ book.title }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="author">
          <mat-header-cell *matHeaderCellDef>Author</mat-header-cell>
          <mat-cell *matCellDef="let book"> {{ book.author.firstName }} {{ book.author.lastName }} </mat-cell>
        </ng-container>

        <ng-container matColumnDef="published">
          <mat-header-cell *matHeaderCellDef>Year</mat-header-cell>
          <mat-cell *matCellDef="let book">{{ book.published }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
          <mat-cell *matCellDef="let book">
            <button mat-icon-button (click)="openDetails(book)" matTooltip="View Details">
              <mat-icon>info</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="openDeleteDialog(book)" matTooltip="Delete Book">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns" class="hover:bg-gray-100 cursor-pointer" @fadeInOut>
        </mat-row>
      </mat-table>

      <!-- Empty State -->
      <div *ngIf="!(loading$ | async) && (books$ | async)?.length === 0" class="text-center p-8" @fadeInOut>
        No books found.
      </div>
    </div>
  `,
  animations: [fadeInOut],
})
export class BookListComponent {
  books$ = this.store.select(selectBooks)
  loading$ = this.store.select(selectBooksLoading)
  error$ = this.store.select(selectBooksError)

  displayedColumns = ['title', 'author', 'published', 'actions']
  title = 'Book List'

/**
 * Creates an instance of BookListComponent.
 * Initializes the component by loading books from the store.
 *
 * @param store - The NGRX store used for dispatching actions and selecting state.
 * @param dialog - The MatDialog service for opening dialog components.
 */
  constructor(
    private store: Store,
    private dialog: MatDialog,
  ) {
    this.loadBooks()
  }

  /**
   * Loads books from the API and dispatches a loadBooks action to the store.
   * Used when the component is initialized and when the user searches for books.
   */
  loadBooks(): void {
    this.store.dispatch(loadBooks())
  }

  /**
   * Opens a dialog displaying the details of the given book.
   *
   * @param book - The book to display in the dialog.
   */
  openDetails(book: Book): void {
    this.dialog.open(BookDetailsComponent, {
      data: { book },
      width: '500px',
      panelClass: 'book-details-dialog',
    })
  }

  /**
   * Opens a dialog for deleting a book.
   * If the user confirms the deletion, dispatches a deleteBook action to the store.
   *
   * @param book - The book to delete.
   */
  openDeleteDialog(book: Book): void {
    const dialogRef = this.dialog.open(DeleteBookDialogComponent, {
      data: { book },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(deleteBook({ id: book.id }));
      }
    });
  }
}
