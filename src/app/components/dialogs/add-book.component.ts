import { CommonModule } from '@angular/common'
import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { Store } from '@ngrx/store'
import { Book } from '../../models/book.interface'
import { addBook, updateBook } from '../../store/actions/books.actions'

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './add-book.component.html',
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup
  isEditing: boolean = false
  currentYear = new Date().getFullYear()
  book = {} as Book

  /**
   * Creates a form to add or edit a book.
   *
   * @param fb The form builder service.
   * @param store The store service.
   * @param dialogRef The dialog reference.
   * @param data The book data, if editing.
   */
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<BookFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: { book: Book },
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      authorFirstName: ['', Validators.required],
      authorLastName: ['', Validators.required],
      published: ['', [Validators.required, Validators.min(1000), Validators.max(this.currentYear)]],
      description: ['', Validators.required],
      cover: ['', Validators.required],
    })
  }

  ngOnInit() {
    if (this.data?.book) {
      this.isEditing = true
      this.bookForm.patchValue({
        title: this.data.book.title,
        authorFirstName: this.data.book.author.firstName,
        authorLastName: this.data.book.author.lastName,
        published: this.data.book.published,
        description: this.data.book.description,
        cover: this.data.book.cover,
      })
    }
  }

  onSubmit() {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.value

      const bookData = {
        // id: this.data?.book?.author?.id || Math.floor(Math.random() * 1000), // Simplified random ID generation
        title: formValue.title,
        author: {
          id: this.data?.book?.author?.id || Math.floor(Math.random() * 1000),
          firstName: formValue.authorFirstName,
          lastName: formValue.authorLastName,
        },
        published: formValue.published,
        description: formValue.description,
        cover: formValue.cover,
      }

      if (this.isEditing && this.data?.book) {
        this.store.dispatch(
          updateBook({
            book: {
              ...bookData,
              id: this.data.book.id,
            },
          }),
        )
      } else {
        this.store.dispatch(addBook({ book: bookData }))
      }

      this.dialogRef.close(true)
    }
  }
}
