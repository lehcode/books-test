import { CommonModule } from '@angular/common'
import { Component, Inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'

import { Book } from '../../models/book.interface'

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <mat-dialog-content>
      <div class="flex gap-4">
        <div>
          <h2>{{ data.book.title }}</h2>
          <img [src]="data.book.cover" alt="Cover of book {{ data.book.title }}" class="w-32 h-48 object-cover" />
          <p>{{ data.book.author.firstName }} {{ data.book.author.lastName }}</p>
        </div>
      </div>
    </mat-dialog-content>
  `,
})
export class BookDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { book: Book }) {}
}
