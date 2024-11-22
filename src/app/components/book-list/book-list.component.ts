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
import { BookFormComponent } from '../dialogs/add-book.component'
import { DeleteBookDialogComponent } from '../dialogs/delete-book.component'

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './book-list.component.html',
  animations: [fadeInOut],
})
export class BookListComponent {
  books$ = this.store.select(selectBooks)
  loading$ = this.store.select(selectBooksLoading)
  error$ = this.store.select(selectBooksError)

  displayedColumns = ['title', 'author', 'published', 'actions']
  title = 'Book List'

  constructor(
    private store: Store,
    private dialog: MatDialog,
  ) {
    this.store.dispatch(loadBooks())
  }

  openAddBookDialog(): void {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh the book list
        this.store.dispatch(loadBooks());
      }
    });
  }

  openEditDialog(book: Book): void {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '500px',
      data: { book },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh the book list
        this.store.dispatch(loadBooks());
      }
    });
  }

  openDetails(book: Book): void {
    this.dialog.open(BookDetailsComponent, {
      data: { book },
      width: '500px',
    })
  }

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
