import { KVNamespace } from '@cloudflare/workers-types'

export interface Env {
  BOOKS_KV: KVNamespace
}

  /**
   * Handle HTTP requests for the /books endpoint.
   *
   * Supported methods:
   * - GET: Returns a list of books
   * - POST: Creates a new book
   * - PUT: Updates an existing book
   * - DELETE: Deletes a book
   *
   * @param context The context object provided by Cloudflare.
   * @returns A Response object.
   */
export const onRequest = async (context: { request: Request; env: Env; params: any }) => {
  const { request, env } = context

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(request.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)
    const id = pathSegments[pathSegments.length - 1]

    switch (request.method) {
      case 'GET': {
        const booksJson = await env.BOOKS_KV.get('books')
        const books = booksJson ? JSON.parse(booksJson) : []
        return new Response(JSON.stringify(books), { headers: corsHeaders })
      }

      case 'POST': {
        const newBook: object = await request.json();
        const booksJson = await env.BOOKS_KV.get('books')
        const books = booksJson ? JSON.parse(booksJson) : []

        const bookWithId = {
          ...newBook,
          id: Date.now()
        }

        books.push(bookWithId)
        await env.BOOKS_KV.put('books', JSON.stringify(books))

        return new Response(JSON.stringify(bookWithId), {
          status: 201,
          headers: corsHeaders
        })
      }

      case 'PUT': {
        if (!id) {
          return new Response('Book ID required', { status: 400, headers: corsHeaders })
        }

        const bookToUpdate: object = await request.json()
        const booksJson = await env.BOOKS_KV.get('books')
        const books = booksJson ? JSON.parse(booksJson) : []

        const updatedBooks = books.map((book: any) =>
          book.id === parseInt(id) ? { ...bookToUpdate, id: parseInt(id) } : book
        )

        await env.BOOKS_KV.put('books', JSON.stringify(updatedBooks))

        return new Response(JSON.stringify(bookToUpdate), {
          status: 200,
          headers: corsHeaders
        })
      }

      case 'DELETE': {
        if (!id) {
          return new Response('Book ID required', { status: 400, headers: corsHeaders })
        }

        const booksJson = await env.BOOKS_KV.get('books')
        const books = booksJson ? JSON.parse(booksJson) : []

        const filteredBooks = books.filter((book: any) => book.id !== parseInt(id))
        await env.BOOKS_KV.put('books', JSON.stringify(filteredBooks))

        return new Response(null, {
          status: 204,
          headers: corsHeaders
        })
      }

      default:
        return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }
  } catch (error: any) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders
    })
  }
}
