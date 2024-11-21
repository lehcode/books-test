import { Author } from "./author.interface"

export interface Book {
  id: number
  title: string
  author: Author
  published: number
  description: string
  cover: string
}
