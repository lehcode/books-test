import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/pages/home/home.page'),
  },
  {
    path: 'books',
    loadChildren: () => import('./routes/books.routes').then(m => m.BOOK_ROUTES)
  },
  {
    path: 'seed',
    loadComponent: () => import('./components/seed/seed.component')
      .then(m => m.SeedComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component')
      .then(m => m.NotFoundComponent)
  }
]
