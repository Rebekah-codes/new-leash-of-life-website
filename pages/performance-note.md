# Performance and HTTP/2 Notes

## Current Status

Your site is deployed on Heroku using the herokuapp.com domain. Heroku's free and standard tiers do **not** support HTTP/2 or HTTP/3 on this domain type.

## Lighthouse Warning: "Modern HTTP"

This warning appears because:

- **Root Cause:** The herokuapp.com domain negotiates only HTTP/1.1
- **Not Code-Fixable:** Heroku controls the protocol negotiation at the edge
- **To Clear This Warning:** You need a custom domain + CDN (see below)

## Current Optimizations in Place

1. **Compression:** Express server uses gzip compression for all responses
2. **Static Caching:** CSS/JS/images cached for 1 day (`Cache-Control: max-age=1d`)
3. **Service Worker:** Offline-capable caching and cache-first strategy
4. **Smart HTML Caching:** HTML pages always validate freshness (`no-cache`)

## Performance Gains (HTTP/1.1 Optimized)

- Response compression reduces payload by ~60–70%
- Static asset caching reduces repeat-visit latency
- Service worker enables offline mode and speeds repeat visits

## Future: To Enable HTTP/2/HTTP/3

When ready, add a custom domain and put it behind **Cloudflare**:

1. Register/own a domain (e.g., `newleashoflife.com`)
2. In Heroku app settings, add the custom domain
3. Point nameservers to Cloudflare
4. In Cloudflare dashboard:
   - Enable "HTTP/2" and "HTTP/3" in Speed settings
   - Set SSL/TLS to "Full (strict)" mode
5. Re-run Lighthouse against your custom domain

This will immediately clear the "Modern HTTP" warning and improve performance significantly.

## Until Then

Your site performs well within HTTP/1.1 constraints. The optimizations above keep load times competitive.
