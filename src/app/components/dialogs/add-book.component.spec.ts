import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideStore, Store } from '@ngrx/store'
import { Observable, of } from 'rxjs'
import { Book } from '../../models/book.interface'
import { bookReducer } from '../../store/reducers/books.reducers'
import { selectBooks } from '../../store/selectors/books.selectors'
import { BookFormComponent } from './add-book.component'

const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close'])
const dialogData = {
  book: {
    id: 999,
    title: 'Test Book',
    author: {
      id: 9989,
      firstName: 'Test',
      lastName: 'Author',
    },
    published: 2022,
    description: 'Test description',
    cover: 'http://example.com/test-cover.jpg',
  },
}

describe('BookFormComponent', () => {
  let component: BookFormComponent
  let store: Store
  let httpClient: HttpClient
  let httpTestingController: HttpTestingController;
  let fixture: ComponentFixture<BookFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule, MatDialogModule, BrowserAnimationsModule, BookFormComponent],
      providers: [
        provideStore({
          books: bookReducer,
        }),
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
      declarations: [],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(Store);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  xit('should add book to store', fakeAsync(async () => {
    const book: Book = dialogData.book;

    // Mock the POST request
    spyOn(httpClient, 'post').and.callFake((url: string, body: any, options: any) => {
      return of(book) as Observable<any>;
    });

    // Fill in the form
    component.bookForm.get('title')?.setValue('Test Book');
    component.bookForm.get('authorFirstName')?.setValue('Test');
    component.bookForm.get('authorLastName')?.setValue('Author');
    component.bookForm.get('published')?.setValue(2022);
    component.bookForm.get('description')?.setValue('Test description');
    component.bookForm.get('cover')?.setValue('http://example.com/test-cover.jpg');

    // Submit the form
    component.onSubmit()
    tick(100); // Allow the store to process the action

    // Verify that the book was added to the store
    await store.select(selectBooks).toPromise().then((books: any) => {
      expect(books.length).toBe(1);
      expect(books[0]).toEqual(jasmine.objectContaining({
        id: book.id,
        title: book.title,
        author: book.author,
        published: book.published,
        description: book.description,
        cover: book.cover,
      }));
    });
  }));
})
