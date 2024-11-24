import { CommonModule } from '@angular/common'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTableModule } from '@angular/material/table'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideStore } from '@ngrx/store'

import { bookReducer } from '../../store/reducers/books.reducer'

import { BookListComponent } from './book-list.component'

describe('BookListComponent', () => {
  let fixture: ComponentFixture<BookListComponent>;
  let component: BookListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTableModule,
        BookListComponent,
        BrowserAnimationsModule
      ],
      providers: [
        provideStore({
          books: bookReducer,
        }),
      ],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(BookListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })


  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
