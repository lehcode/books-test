// functions/api/books.ts
import { KVNamespace } from '@cloudflare/workers-types'

export interface Env {
  BOOKS_KV: KVNamespace
}

export interface CloudflareContext {
  request: Request
  env: Env
  params: { [key: string]: string }
}

export const onRequest = async (context: CloudflareContext) => {
  const { request, env } = context

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type'
  }

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers })
  }

  try {
    switch (request.method) {
      case 'GET':
        const books = await env.BOOKS_KV.get('books', 'json') || []
        return new Response(JSON.stringify(books), { headers })

      case 'POST':
        const newBook = await request.json()
        const existingBooks = (await env.BOOKS_KV.get('books', 'json') || []) as any[];
        newBook.id = Date.now()
        const updatedBooks = [...existingBooks, newBook]
        await env.BOOKS_KV.put('books', JSON.stringify(updatedBooks))
        return new Response(JSON.stringify(newBook), { headers })

      case 'PUT':
        const bookToUpdate = await request.json()
        const currentBooks = await env.BOOKS_KV.get('books', 'json') || []
        const updatedBookList = (currentBooks as any[]).map((book: any) =>
          book.id === bookToUpdate.id ? bookToUpdate : book
        )
        await env.BOOKS_KV.put('books', JSON.stringify(updatedBookList))
        return new Response(JSON.stringify(bookToUpdate), { headers })

      case 'DELETE':
        const url = new URL(request.url)
        const id = parseInt(url.pathname.split('/').pop() || '')
        const booksToFilter = await env.BOOKS_KV.get('books', 'json') || []
        const filteredBooks = (booksToFilter as any[]).filter((book: any) => book.id !== id)
        await env.BOOKS_KV.put('books', JSON.stringify(filteredBooks))
        return new Response(null, { headers })

      default:
        return new Response('Method not allowed', { status: 405, headers })
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers
    })
  }
}
