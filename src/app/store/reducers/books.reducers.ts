import { createReducer, on } from '@ngrx/store'
import { Book } from '../../models/book.interface'
import {
  deleteBook,
  deleteBookFailure,
  deleteBookSuccess,
  loadBooks,
  loadBooksSuccess
} from '../actions/books.actions'

export interface IBooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
  searchQuery: any
}

const initialState: IBooksState = {
  books: [],
  loading: false,
  error: null,
  searchQuery: null
};

export const bookReducer = createReducer(
  initialState,
  on(loadBooks, (state) => ({ ...state, loading: true })),
  on(loadBooksSuccess, (state, { books }) => ({
    ...state,
    books,
    loading: false
  })),
  on(deleteBook, (state) => ({
    ...state,
    loading: true
  })),
  on(deleteBookSuccess, (state, { id }) => ({
    ...state,
    books: state.books.filter(book => book.id !== id),
    loading: false
  })),
  on(deleteBookFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
