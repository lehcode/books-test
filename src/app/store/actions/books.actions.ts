import { createAction, props } from '@ngrx/store'
import { Book } from '../../models/book.interface'

// Load books
export const loadBooks = createAction('[Books] Load Books');

export const loadBooksSuccess = createAction(
  '[Books] Load Books Success',
  props<{ books: Book[] }>()
);

export const loadBooksFailure = createAction(
  '[Books] Load Books Failure',
  props<{ error: string }>()
);

// Delete single book
export const deleteBook = createAction(
  '[Books] Delete Book',
  props<{ id: number }>()
);
export const deleteBookSuccess = createAction(
  '[Books] Delete Book Success',
  props<{ id: number }>()
);
export const deleteBookFailure = createAction(
  '[Books] Delete Book Failure',
  props<{ error: string }>()
);


