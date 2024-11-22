import { createFeatureSelector, createSelector } from '@ngrx/store'
import { IBooksState } from '../reducers/books.reducers'

export const selectBooksState = createFeatureSelector<IBooksState>('books')

export const selectBooks = createSelector(selectBooksState, (state: IBooksState) => state.books)

export const selectBooksLoading = createSelector(selectBooksState, (state: IBooksState) => state.loading)

export const selectBooksError = createSelector(selectBooksState, (state: IBooksState) => state.error)

// Search selector
export const selectFilteredBooks = createSelector(
  selectBooks,
  (state: IBooksState) => state.searchQuery,
  (books, searchQuery) => {
    if (!searchQuery) return books

    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${book.author.firstName} ${book.author.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  },
)

// Single book selector
export const selectBookById = (bookId: number) =>
  createSelector(selectBooks, (books) => books.find((book) => book.id === bookId))
