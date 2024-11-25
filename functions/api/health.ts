import { Env } from "../interfaces/env.interface"

export const onRequest = async (context: { env: Env }) => {
  const { env } = context

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  try {
    const status = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasEnv: !!env,
      envKeys: Object.keys(env || {}),
      hasKV: !!env?.BOOKS_KV,
      kvTest: null as any
    }

    if (env?.BOOKS_KV) {
      try {
        // Test KV operations
        await env.BOOKS_KV.put('health_check', 'ok')
        const testRead = await env.BOOKS_KV.get('health_check')
        status.kvTest = testRead === 'ok'
      } catch (kvError) {
        status.kvTest = {
          error: kvError.message,
          type: kvError.name
        }
      }
    }

    return new Response(JSON.stringify(status, null, 2), {
      headers: corsHeaders
    })
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Health check failed',
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
