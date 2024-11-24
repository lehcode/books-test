import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators'

import { setSearchQuery } from '../../store/actions/books.actions'

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <div class="w-full max-w-md mx-auto mb-6">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Search books</mat-label>
        <input matInput [formControl]="searchControl" placeholder="Search by title or author">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class BookSearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit() {
    // Subscribe to search input changes
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.store.dispatch(setSearchQuery({ query: query || '' }));
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
