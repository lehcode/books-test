import { CommonModule } from '@angular/common';
import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet,  RouterLink, RouterLinkActive],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export default class HomePage {
  title = 'librarian'

  links = [
    { title: 'Explore the Books', link: '/books' },
  ]
}
