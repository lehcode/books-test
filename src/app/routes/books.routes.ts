import { Routes } from '@angular/router'

import { BookDetailsComponent } from '../components/book-details/book-details.component'
import { BooksListComponent } from '../components/books-list/books-list.component'

export const BOOK_ROUTES: Routes = [
  {
    path: '',
    component: BooksListComponent,
  },
  {
    path: ':id',
    component: BookDetailsComponent
  }
];
