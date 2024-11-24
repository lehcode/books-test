import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"

import { Book } from "../models/book.interface"

const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8788/api' : '/api'

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${apiUrl}/books`

  constructor(private http: HttpClient) {}

  /**
   * Gets a list of books from the API.
   *
   * @returns an Observable emitting the list of books
   */
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    )
  }

  /**
   * Adds a new book to the API.
   *
   * @param book the new book to add (without id)
   * @returns an Observable emitting the newly added book
   */
  addBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book).pipe(
      catchError(this.handleError)
    )
  }

  /**
   * Updates a book in the API.
   *
   * @param book the book to update (with id)
   * @returns an Observable emitting the updated book
   */
  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${book.id}`, book).pipe(
      catchError(this.handleError)
    )
  }

  /**
   * Deletes a book from the API.
   *
   * @param id the id of the book to delete
   * @returns an Observable emitting void
   */
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    )
  }

  /**
   * A helper function to handle errors in the service.
   *
   * Prints the error to the console and returns an Observable that emits an error.
   *
   * @param error the error to handle
   * @returns an Observable emitting an error
   */
  private handleError(error: any) {
    console.error('An error occurred:', error)
    return throwError(() => new Error(error.message || 'Server error'))
  }
}
