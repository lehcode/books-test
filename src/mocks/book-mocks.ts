import { Book } from "../app/models/book.interface"

import booksKV from "./book-mocks-kv.json"


export const MOCK_BOOKS = booksKV.map((pair) => (JSON.parse(pair.value) as Book) || pair.value);

