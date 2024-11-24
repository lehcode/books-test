import { KVNamespace } from '@cloudflare/workers-types'

export interface Env {
  BOOKS_KV: KVNamespace
}

export const onRequest = async (context: { request: Request; env: Env; params: any }) => {
  const { request, env } = context

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Content-Security-Policy': "default-src *; img-src *; script-src *; style-src *; font-src *;",
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Access-Control-Allow-Credentials': 'true',
  }

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Validate KV binding
  if (!env?.BOOKS_KV) {
    console.error('BOOKS_KV binding is not available:', env)
    return new Response(
      JSON.stringify({
        error: 'Storage service is not available',
        debug: {
          env: JSON.stringify(env),
          kvExists: !!env?.BOOKS_KV,
        },
      }),
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }

  try {
    const url = new URL(request.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)
    const id = pathSegments[pathSegments.length - 1]

    switch (request.method) {
      case 'GET': {
        try {
          console.time('GetBooks')

          const booksJson = await env.BOOKS_KV.get('books')

          console.time('GetBooks Completed')
          console.log(booksJson)

          if (!booksJson) {
            // If no books exist, initialize with empty array
            await env.BOOKS_KV.put('books', '[]')
            return new Response('[]', { headers: corsHeaders })
          }

          return new Response(booksJson, { headers: corsHeaders })
        } catch (kvError) {
          console.error('KV operation failed:', kvError)
          return new Response(
            JSON.stringify({
              error: 'Failed to retrieve books',
              details: kvError.message,
            }),
            {
              status: 500,
              headers: corsHeaders,
            },
          )
        }
      }

      case 'POST': {
        const newBook: object = await request.json()
        const booksJson = await env.BOOKS_KV.get('books')
        const books = booksJson ? JSON.parse(booksJson) : []

        const bookWithId = {
          ...newBook,
          id: Date.now(),
        }

        books.push(bookWithId)
        await env.BOOKS_KV.put('books', JSON.stringify(books))

        return new Response(JSON.stringify(bookWithId), {
          status: 201,
          headers: corsHeaders,
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
          book.id === parseInt(id) ? { ...bookToUpdate, id: parseInt(id) } : book,
        )

        await env.BOOKS_KV.put('books', JSON.stringify(updatedBooks))

        return new Response(JSON.stringify(bookToUpdate), {
          status: 200,
          headers: corsHeaders,
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
          headers: corsHeaders,
        })
      }

      default:
        return new Response('Method not allowed', {
          status: 405,
          headers: corsHeaders,
        })
    }
  } catch (error: any) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}
