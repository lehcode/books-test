import { CommonModule } from '@angular/common'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { Book } from '../../models/book.interface'
import { DeleteBookDialogComponent } from './delete-book.component'

describe('DeleteBookComponent', () => {
  let component: DeleteBookDialogComponent;
  let fixture: ComponentFixture<DeleteBookDialogComponent>;
  let mockBook: Book;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DeleteBookDialogComponent>>;

  beforeEach(async () => {
    mockBook = {
      id: 1,
      title: 'Mock Book',
      author: { id: 1, firstName: 'Mock', lastName: 'Author' },
      published: 2022,
      description: 'Mock book description',
      cover: 'https://example.com/mock-book-cover.jpg'
    };

    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatDialogModule,
        DeleteBookDialogComponent
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { book: mockBook } },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteBookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have book property set', () => {
    expect(component.book).toEqual(mockBook);
  });
});
