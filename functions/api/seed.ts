import { MOCK_BOOKS } from '../../src/mocks/book-mocks'

/**
 * Seeds the KV store with mock data if no books exist
 *
 * @param {object} context - The context object from the Workers runtime
 * @param {object} context.env - The environment object from the Workers runtime
 * @param {KVNamespace} context.env.BOOKS_KV - The KV namespace for the books data
 * @returns {Promise<Response>} - A Response object with a status code and a message
 */
export const onRequest = async (context: { env: { BOOKS_KV: KVNamespace } }): Promise<Response> => {
  const { env } = context

  try {
    // Check if books already exist
    const existingBooks = JSON.parse(await env.BOOKS_KV.get('books') as string)

    if (existingBooks?.length === 0) {
      // Initialize with mock data if no books exist
      await env.BOOKS_KV.put('books', JSON.stringify(MOCK_BOOKS))
      return new Response('KV store seeded successfully', { status: 200 })
    } else {
      return new Response('Books already exist in KV', { status: 200 })
    }

    return new Response('Failed to seed KV store.', { status: 500 })
  } catch (error) {
    return new Response('Failed to seed KV store: ' + error, { status: 500 })
  }
}
