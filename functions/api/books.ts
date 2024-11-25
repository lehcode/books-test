import { KVNamespace } from '@cloudflare/workers-types'
import { MOCK_BOOKS } from '../../src/mocks/book-mocks'

interface Env {
  BOOKS_KV: KVNamespace
}

export const onRequest = async (context: { request: Request; env: Env; params: any }) => {
  const { request, env } = context

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
    'Content-Type': 'application/json'
  }

  // Enhanced CORS preflight handling
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204, // No content for OPTIONS
      headers: corsHeaders
    })
  }

  // Debug logging
  console.log('API Request:', {
    method: request.method,
    url: request.url,
    hasKV: !!env?.BOOKS_KV
  })

  try {
    // Validate KV binding
    if (!env?.BOOKS_KV) {
      return new Response(JSON.stringify({
        error: 'Storage service configuration issue',
        debug: {
          environment: process.env.NODE_ENV,
          hasEnv: !!env,
          envKeys: Object.keys(env || {}),
          hasKV: !!env?.BOOKS_KV
        }
      }), {
        status: 500,
        headers: corsHeaders
      })
    }

    const url = new URL(request.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)
    const id = pathSegments[pathSegments.length - 1]

    switch (request.method) {
      case 'GET': {
        try {
          const booksJson = await env.BOOKS_KV.get('books')

          if (!booksJson) {
            // Initialize with mock data if empty
            await env.BOOKS_KV.put('books', JSON.stringify(MOCK_BOOKS))
            return new Response(JSON.stringify(MOCK_BOOKS), {
              headers: corsHeaders
            })
          }

          return new Response(booksJson, {
            headers: corsHeaders
          })
        } catch (kvError) {
          console.error('KV Read Error:', kvError)
          return new Response(JSON.stringify({
            error: 'Failed to retrieve books',
            details: kvError.message
          }), {
            status: 500,
            headers: corsHeaders
          })
        }
      }

      case 'POST': {
        try {
          const newBook = await request.json()
          const booksJson = await env.BOOKS_KV.get('books')
          const books = booksJson ? JSON.parse(booksJson) : []

          const bookWithId = {
            ...newBook,
            id: Date.now() // Simple ID generation
          }

          books.push(bookWithId)
          await env.BOOKS_KV.put('books', JSON.stringify(books))

          return new Response(JSON.stringify(bookWithId), {
            status: 201,
            headers: corsHeaders
          })
        } catch (error) {
          console.error('POST Error:', error)
          return new Response(JSON.stringify({
            error: 'Failed to create book',
            details: error.message
          }), {
            status: 500,
            headers: corsHeaders
          })
        }
      }

      case 'PUT': {
        try {
          if (!id) {
            return new Response(JSON.stringify({
              error: 'Book ID is required'
            }), {
              status: 400,
              headers: corsHeaders
            })
          }

          const bookId = parseInt(id)
          const updatedBook = await request.json()
          const booksJson = await env.BOOKS_KV.get('books')

          if (!booksJson) {
            return new Response(JSON.stringify({
              error: 'No books found'
            }), {
              status: 404,
              headers: corsHeaders
            })
          }

          const books = JSON.parse(booksJson)
          const bookIndex = books.findIndex((book: any) => book.id === bookId)

          if (bookIndex === -1) {
            return new Response(JSON.stringify({
              error: 'Book not found'
            }), {
              status: 404,
              headers: corsHeaders
            })
          }

          // Update the book while preserving its ID
          books[bookIndex] = {
            ...updatedBook,
            id: bookId // Ensure ID remains unchanged
          }

          await env.BOOKS_KV.put('books', JSON.stringify(books))

          return new Response(JSON.stringify(books[bookIndex]), {
            status: 200,
            headers: corsHeaders
          })
        } catch (error) {
          console.error('PUT Error:', error)
          return new Response(JSON.stringify({
            error: 'Failed to update book',
            details: error.message
          }), {
            status: 500,
            headers: corsHeaders
          })
        }
      }

      case 'DELETE': {
        try {
          if (!id) {
            return new Response(JSON.stringify({
              error: 'Book ID is required'
            }), {
              status: 400,
              headers: corsHeaders
            })
          }

          const bookId = parseInt(id)
          const booksJson = await env.BOOKS_KV.get('books')

          if (!booksJson) {
            return new Response(JSON.stringify({
              error: 'No books found'
            }), {
              status: 404,
              headers: corsHeaders
            })
          }

          const books = JSON.parse(booksJson)
          const updatedBooks = books.filter((book: any) => book.id !== bookId)

          if (books.length === updatedBooks.length) {
            return new Response(JSON.stringify({
              error: 'Book not found'
            }), {
              status: 404,
              headers: corsHeaders
            })
          }

          await env.BOOKS_KV.put('books', JSON.stringify(updatedBooks))

          return new Response(null, {
            status: 204, // No content for successful DELETE
            headers: corsHeaders
          })
        } catch (error) {
          console.error('DELETE Error:', error)
          return new Response(JSON.stringify({
            error: 'Failed to delete book',
            details: error.message
          }), {
            status: 500,
            headers: corsHeaders
          })
        }
      }

      default:
        return new Response(null, {
          status: 204, // No content for OPTIONS
          headers: corsHeaders
        })
    }
  } catch (error: any) {
    console.error('Request Processing Error:', error)
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message,
      debug: {
        errorType: error.name,
        hasEnv: !!env,
        hasKV: !!env?.BOOKS_KV
      }
    }), {
      status: 500,
      headers: corsHeaders
    })
  }
}
