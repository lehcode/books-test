import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of } from 'rxjs'
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators'
import { MOCK_BOOKS } from '../../../mocks/book-mocks'
import * as BookActions from '../actions/books.actions'
import { selectBooks } from '../selectors/books.selectors'


@Injectable()
export class BooksEffects {
  constructor(
    private actions$: Actions,
    private store: Store
  ) {}

  loadBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.loadBooks),
      withLatestFrom(this.store.select(selectBooks)),
      switchMap(([_, books]) => {
        // If books exist in store, return them
        if (books.length > 0) {
          return of(BookActions.loadBooksSuccess({ books }))
        }
        // Otherwise load from mock data
        return of(MOCK_BOOKS).pipe(
          map((booksCollection) => BookActions.loadBooksSuccess({ books: booksCollection })),
          catchError((error) => of(BookActions.loadBooksFailure({ error: error.message }))),
        )
      }),
    ),
  )

  // Delete book
  deleteBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.deleteBook),
      switchMap(({ id }) =>
        of(id).pipe(
          map((deletedId) => BookActions.deleteBookSuccess({ id: deletedId })),
          catchError((error) => of(BookActions.deleteBookFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  // Add book with generated ID
  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.addBook),
      mergeMap(({ book }) =>
        of({ ...book, id: Date.now() }).pipe( // More unique ID generation
          map((newBook) => BookActions.addBookSuccess({ book: newBook })),
          catchError((error) => of(BookActions.addBookFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  // Update book
  updateBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.updateBook),
      mergeMap(({ book }) =>
        of(book).pipe(
          map((updatedBook) => BookActions.updateBookSuccess({ book: updatedBook })),
          catchError((error) => of(BookActions.updateBookFailure({ error: error.message }))),
        ),
      ),
    ),
  )
}
