import { CommonModule } from '@angular/common'
import { Component, Inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { Book } from '../../models/book.interface'

@Component({
  selector: 'app-delete-book-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
  <h2 mat-dialog-title>Delete Book</h2>
    <mat-dialog-content>
      Are you sure you want to delete "{{ data.book.title }}"?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Delete</button>
    </mat-dialog-actions>
  `,
  styles: ``,
})

export class DeleteBookDialogComponent {
  book: Book;

  constructor(
    public dialogRef: MatDialogRef<DeleteBookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { book: Book }
  ) {
    this.book = data.book;
  }
}
