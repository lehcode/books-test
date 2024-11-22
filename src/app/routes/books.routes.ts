import { Routes } from '@angular/router'
import { BookDetailsComponent } from '../components/book-details/book-details.component'
import { BookListComponent } from '../components/book-list/book-list.component'

export const BOOK_ROUTES: Routes = [
  {
    path: '',
    component: BookListComponent,
  },
  {
    path: ':id',
    component: BookDetailsComponent
  }
];
