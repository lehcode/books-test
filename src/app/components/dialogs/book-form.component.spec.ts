import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, FormGroup } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideStore, Store } from '@ngrx/store'

import { updateBook } from '../../store/actions/books.actions'
import { bookReducer } from '../../store/reducers/books.reducer'

import { BookFormComponent } from './book-form.component'

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

    component.bookForm = new FormGroup({
      title: new FormControl(''),
      authorFirstName: new FormControl(''),
      authorLastName: new FormControl(''),
      published: new FormControl(''),
      description: new FormControl(''),
      cover: new FormControl('')
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should dispatch updateBook action when editing an existing book', () => {
    const mockFormValue = {
      title: 'Test Book',
      authorFirstName: 'Test',
      authorLastName: 'Author',
      published: 2022,
      description: 'Test description',
      cover: 'http://example.com/test-cover.jpg'
    };

    component.bookForm.patchValue(mockFormValue);
    const storeSpy = spyOn(store, 'dispatch');

    component.onSubmit();

    expect(storeSpy).toHaveBeenCalledWith(updateBook({
      book: {
        id: 999,
        title: mockFormValue.title,
        author: {
          id: 9989,
          firstName: mockFormValue.authorFirstName,
          lastName: mockFormValue.authorLastName
        },
        published: mockFormValue.published,
        description: mockFormValue.description,
        cover: mockFormValue.cover
      }
    }));
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
})
