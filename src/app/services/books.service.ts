import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { Book } from "../models/book.interface"

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl: string = '/api/books'

  constructor(private http: HttpClient) {}

  /**
   * Gets all books from the API.
   * @returns An observable that contains an array of Book objects.
   */
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl)
  }

  /**
   * Adds a new book to the API.
   * @param book The book to add (without an id).
   * @returns An observable that contains the newly added book.
   */
  addBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${book.id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
