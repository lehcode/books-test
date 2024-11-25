import { KVNamespace } from "@cloudflare/workers-types"

export interface Env {
  BOOKS_KV: KVNamespace;
}
