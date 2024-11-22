import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"


@Component({
  selector: 'app-books-page',
  standalone: true,
  template: `
    <div class="p-4">
      <router-outlet></router-outlet>
    </div>
  `,
  imports: [RouterOutlet],
})
export default class BooksPage {}
