import { Component, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { Book } from '../../models/book.interface'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <mat-dialog-content>
      <div class="flex gap-4">
        <img [src]="data.book.cover" class="w-32 h-48 object-cover"/>
        <div>
          <h2>{{data.book.title}}</h2>
          <p>{{data.book.author.firstName}} {{data.book.author.lastName}}</p>
          <!-- Additional details -->
        </div>
      </div>
    </mat-dialog-content>
  `
})
export class BookDetailsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {book: Book}
  ) {}
}
