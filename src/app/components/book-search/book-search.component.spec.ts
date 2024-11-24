import { CommonModule } from '@angular/common'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideStore } from '@ngrx/store'

import { Book } from '../../models/book.interface'
import { bookReducer } from '../../store/reducers/books.reducer'

import { BookSearchComponent } from './book-search.component'

describe('BookSearchComponent', () => {
  let component: BookSearchComponent
  let fixture: ComponentFixture<BookSearchComponent>
  let mockBook: Book;

  beforeEach(async () => {
    mockBook = {
      id: 1,
      title: 'Mock Book',
      author: { id: 1, firstName: 'Mock', lastName: 'Author' },
      published: 2022,
      description: 'Mock book description',
      cover: 'https://example.com/mock-book-cover.jpg'
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BookSearchComponent,
        BrowserAnimationsModule
      ],
      providers: [
        provideStore({
          books: bookReducer,
        }),
      ],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(BookSearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
