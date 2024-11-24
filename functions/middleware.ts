import createMiddleware from '@cloudflare/pages-plugin-cloudflare-access'

export const onRequest = createMiddleware({
  loginPath: '/login',
  // Optional: Protect specific paths
  // includePaths: ['/admin'],
})
