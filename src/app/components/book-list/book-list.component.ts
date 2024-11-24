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
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  animations: [fadeInOut],
})
export class BookListComponent {
  books$ = this.store.select(selectBooks)
  loading$ = this.store.select(selectBooksLoading)
  error$ = this.store.select(selectBooksError)

  displayedColumns = ['title', 'author', 'published', 'info'];
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
