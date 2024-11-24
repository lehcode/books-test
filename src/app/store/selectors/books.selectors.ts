import { createFeatureSelector, createSelector } from '@ngrx/store'

import { IBooksState } from '../reducers/books.reducer'

export const selectBookState = createFeatureSelector<IBooksState>('books')
export const selectBooks = createSelector(selectBookState, (state: IBooksState) => state.books)
export const selectBooksLoading = createSelector(selectBookState, (state: IBooksState) => state.loading)
export const selectBooksError = createSelector(selectBookState, (state: IBooksState) => state.error)
export const selectSearchQuery = createSelector(selectBookState, (state: IBooksState) => state.searchQuery)

// Filtered books
export const selectFilteredBooks = createSelector(
  selectBooks,
  selectSearchQuery,
  (books, searchQuery) => {
    if (!searchQuery) return books;

    const query = searchQuery.toLowerCase();
    return books.filter((book) =>
      book.title.toLowerCase().includes(query) ||
      `${book.author.firstName} ${book.author.lastName}`.toLowerCase().includes(query) ||
      book.published.toString().includes(query)
    );
  }
)
