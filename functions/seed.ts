import { MOCK_BOOKS } from '../src/mocks/book-mocks'

export const onRequest = async (context: { env: { BOOKS_KV: KVNamespace } }) => {
  const { env } = context

  try {
    // Check if books already exist
    const existingBooks = await env.BOOKS_KV.get('books')

    if (!existingBooks) {
      // Initialize with mock data if no books exist
      await env.BOOKS_KV.put('books', JSON.stringify(MOCK_BOOKS))
      return new Response('KV store seeded successfully', { status: 200 })
    }

    return new Response('Books already exist in KV', { status: 200 })
  } catch (error) {
    return new Response('Failed to seed KV store: ' + error, { status: 500 })
  }
}
