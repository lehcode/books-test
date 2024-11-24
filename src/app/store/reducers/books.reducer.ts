import { createReducer, on } from '@ngrx/store'

import { Book } from '../../models/book.interface'
import * as BookActions from '../actions/books.actions'

export interface IBooksState {
  books: Book[]
  loading: boolean
  error: string | null
  searchQuery: string
}

const initialState: IBooksState = {
  books: [],
  loading: false,
  error: null,
  searchQuery: ''
}

export const bookReducer = createReducer(
  initialState,
  // Load books
  on(BookActions.loadBooks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(BookActions.loadBooksSuccess, (state, { books }) => ({
    ...state,
    books,
    loading: false,
    error: null
  })),

  on(BookActions.loadBooksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete book
  on(BookActions.deleteBookSuccess, (state, { id }) => ({
    ...state,
    books: state.books.filter((book) => book.id !== id),
    error: null
  })),

  on(BookActions.deleteBookFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // Add book
  on(BookActions.addBookSuccess, (state, { book }) => ({
    ...state,
    books: [...state.books, book],
    error: null
  })),

  on(BookActions.addBookFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // Update book
  on(BookActions.updateBookSuccess, (state, { book }) => ({
    ...state,
    books: state.books.map((b) => (b.id === book.id ? book : b)),
    error: null
  })),

  on(BookActions.updateBookFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // Search
  on(BookActions.setSearchQuery, (state, { query }) => ({
    ...state,
    searchQuery: query
  }))
)
