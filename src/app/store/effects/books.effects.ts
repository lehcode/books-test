import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { MOCK_BOOKS } from '../../../mocks/books-mocks'
import { BookService } from '../../services/books.service'
import { deleteBook, deleteBookFailure, deleteBookSuccess, loadBooks, loadBooksFailure, loadBooksSuccess } from '../actions/books.actions'

@Injectable()
export class BooksEffects {
  loadBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBooks),
      switchMap(() =>
        of(MOCK_BOOKS).pipe(
          map((booksCollection) => loadBooksSuccess({ books: booksCollection })),
          catchError((error) => of(loadBooksFailure({ error: error.message })))
        )
      )
    )
  );

  deleteBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBook),
      switchMap(({ id }) =>
        // Since we're using mock data, we'll simulate a successful delete
        of(id).pipe(
          map((deletedId) => deleteBookSuccess({ id: deletedId })),
          catchError((error) => of(deleteBookFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private bookService: BookService
  ) {}
}
