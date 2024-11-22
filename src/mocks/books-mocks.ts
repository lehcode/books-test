import { Book } from "../app/models/book.interface"

export const MOCK_BOOKS: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: {
      id: 1,
      firstName: "F. Scott",
      lastName: "Fitzgerald"
    },
    published: 1925,
    description: "A story of the fabulously wealthy Jay Gatsby and his love for Daisy Buchanan.",
    cover: "https://www.britishbook.ua/upload/resize_cache/iblock/ab7/c78bi7zf84kfg3a0wrayoy1wm23610ka/1900_800_174b5ed2089e1946312e2a80dcd26f146/knyga_the_great_gatsby.jpeg"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: {
      id: 2,
      firstName: "Harper",
      lastName: "Lee"
    },
    published: 1960,
    description: "A gripping tale of racial injustice and moral growth in the American South.",
    cover: "https://www.britishbook.ua/upload/resize_cache/iblock/065/f8l2e1d9483a2skiu4bs98g1qq6ihnjm/329_500_174b5ed2089e1946312e2a80dcd26f146/knyga_to_kill_a_mockingbird.jpeg"
  },
  {
    id: 3,
    title: "1984",
    author: {
      id: 3,
      firstName: "George",
      lastName: "Orwell"
    },
    published: 1949,
    description: "A dystopian novel exploring themes of surveillance, truth, and totalitarianism.",
    cover: "https://content.rozetka.com.ua/goods/images/big/288176973.png"
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: {
      id: 4,
      firstName: "Jane",
      lastName: "Austen"
    },
    published: 1813,
    description: "A classic novel about love and societal expectations in Regency-era England.",
    cover: "https://www.britishbook.ua/upload/resize_cache/iblock/4ed/3dxhze1z65u9endobnyqzvz5xswb8tf8/263_400_174b5ed2089e1946312e2a80dcd26f146/kniga_pride_and_prejudice.jpg"
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: {
      id: 5,
      firstName: "J.D.",
      lastName: "Salinger"
    },
    published: 1951,
    description: "A coming-of-age story of teenage rebellion and alienation.",
    cover: "https://content.rozetka.com.ua/goods/images/big/336376750.jpg"
  }
];