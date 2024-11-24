import { KVNamespace } from '@cloudflare/workers-types'

declare global {
  interface Env {
    BOOKS_KV: KVNamespace
  }
}

export { }

