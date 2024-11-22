import { CommonModule } from '@angular/common'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { Book } from '../../models/book.interface'
import { BookDetailsComponent } from './book-details.component'

describe('BookDetailsComponent', () => {
  let fixture: ComponentFixture<BookDetailsComponent>;
  let component: BookDetailsComponent;

  beforeEach(async () => {
    const mockBook: Book = {
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
        BookDetailsComponent
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
})
