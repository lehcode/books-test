import { CommonModule } from '@angular/common'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { Book } from '../../models/book.interface'

import { BookDetailsComponent } from './book-details.component'

describe('BookDetailsComponent', () => {
  let fixture: ComponentFixture<BookDetailsComponent>;
  let component: BookDetailsComponent;
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
        MatDialogModule,
        BookDetailsComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { book: mockBook } }
      ],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })


  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should correctly initialize component with injected book data', () => {
    fixture = TestBed.createComponent(BookDetailsComponent);
    component = fixture.componentInstance;

    expect(component.data.book).toEqual(mockBook);
  });
})
