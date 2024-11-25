import { KVNamespace } from '@cloudflare/workers-types'

import { corsHeaders as baseHeaders } from '../constants'

export interface Env {
  BOOKS_KV: KVNamespace
  BOOKS_KV_PROD?: KVNamespace
}

export const onRequest = async (context: { request: Request; env: Env; params: any }) => {
  const { request, env } = context

  const corsHeaders = {
    ...baseHeaders,
    'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204, // No content for OPTIONS
      headers: corsHeaders,
    })
  }

  console.log("Env:", env)

  const kv = env?.BOOKS_KV || env?.BOOKS_KV_PROD

  // Validate KV binding
  if (!kv) {
    console.error('BOOKS_KV binding is not available:', env)
    return new Response(
      JSON.stringify({
        error: 'Storage service is not available',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }

  try {
    // Add Content-Type header for JSON responses
    const jsonHeaders = {
      ...corsHeaders,
      'Content-Type': 'application/json',
    }

    switch (request.method) {
      case 'GET': {
        const booksJson = await env.BOOKS_KV.get('books')
        return new Response(booksJson || '[]', {
          headers: jsonHeaders,
        })
      }

      case 'POST': {
        const newBook = await request.json()
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
          headers: jsonHeaders,
        })
      }

      case 'DELETE': {
        /* Workaround for Cloudflare request limitations for OPTIONS, PUT, and DELETE.
         * DELETE requests are processed in _middleware.ts
         */
        break
      }

      case 'PUT': {
        /* Workaround for Cloudflare request limitations for OPTIONS, PUT, and DELETE.
         * PUT requests are processed in _middleware.ts
         */
        break
      }

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: jsonHeaders,
        })
    }
  } catch (error: any) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
