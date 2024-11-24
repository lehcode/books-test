import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of } from 'rxjs'
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators'
import { BookService } from '../../services/books.service'
import * as BookActions from '../actions/books.actions'

@Injectable()
export class BooksEffects {
  constructor(
    private actions$: Actions,
    private bookService: BookService,
    private store: Store
  ) {}

  loadBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.loadBooks),
      switchMap(() =>
        this.bookService.getBooks().pipe(
          map((books) => BookActions.loadBooksSuccess({ books })),
          catchError((error) => of(BookActions.loadBooksFailure({ error: error.message })))
        )
      )
    )
  )

  deleteBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.deleteBook),
      mergeMap(({ id }) =>
        this.bookService.deleteBook(id).pipe(
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
        this.bookService.addBook(book).pipe(
          map((newBook) => BookActions.addBookSuccess({ book: newBook })),
          catchError((error) => of(BookActions.addBookFailure({ error: error.message })))
        )
      )
    )
  )

  updateBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.updateBook),
      mergeMap(({ book }) =>
        this.bookService.updateBook(book).pipe(
          map((updatedBook) => BookActions.updateBookSuccess({ book: updatedBook })),
          catchError((error) => of(BookActions.updateBookFailure({ error: error.message })))
        )
      )
    )
  )
}
