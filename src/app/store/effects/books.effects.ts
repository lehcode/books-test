import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of } from 'rxjs'
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators'

import { Book } from '../../models/book.interface'
import { BooksService } from '../../services/books.service'
import * as BookActions from '../actions/books.actions'


@Injectable()
export class BooksEffects {
  constructor(
    private actions$: Actions,
    private booksService: BooksService,
    private store: Store
  ) {}

  loadBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.loadBooks),
      switchMap(() =>
        this.booksService.getBooks().pipe(
          map((books: Book[]) => BookActions.loadBooksSuccess({ books })),
          catchError((error) => of(BookActions.loadBooksFailure({ error: error.message })))
        )
      )
    )
  )

  deleteBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.deleteBook),
      mergeMap(({ id }) =>
        this.booksService.deleteBook(id).pipe(
          map(() => BookActions.deleteBookSuccess({ id })),
          catchError((error) => of(BookActions.deleteBookFailure({ error: error.message })))
        )
      )
    )
  )

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.addBook),
      mergeMap(({ book }) =>
        this.booksService.addBook(book).pipe(
          map((newBook: Book) => BookActions.addBookSuccess({ book: newBook })),
          catchError((error) => of(BookActions.addBookFailure({ error: error.message })))
        )
      )
    )
  )

  updateBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.updateBook),
      mergeMap(({ book }) =>
        this.booksService.updateBook(book).pipe(
          map((updatedBook: Book) => BookActions.updateBookSuccess({ book: updatedBook })),
          catchError((error) => of(BookActions.updateBookFailure({ error: error.message })))
        )
      )
    )
  )
}
