import { provideHttpClient } from '@angular/common/http'
import { ApplicationConfig, isDevMode } from '@angular/core'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router'
import { provideEffects } from '@ngrx/effects'
import { provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'

import { routes } from './app.routes'
import { provideMaterialConfig } from './material.provider'
import { BooksEffects } from './store/effects/books.effects'
import { bookReducer } from './store/reducers/books.reducers'

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimationsAsync(),
    provideMaterialConfig(),
    provideStore({
      books: bookReducer
    }),
    provideEffects(BooksEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        onSameUrlNavigation: 'reload',
        paramsInheritanceStrategy: 'always'
      })
    )
  ],
}
