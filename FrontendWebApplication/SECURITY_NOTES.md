# Security Notes (Frontend)

- JWT is stored in localStorage for simplicity in this demo. For production, consider:
  - Using HTTP‑only secure cookies to mitigate XSS token theft.
  - Strict Content Security Policy (CSP).
  - Avoid logging sensitive data.
- Ensure the backend sets proper CORS and HTTPS is enforced in production.
- Token refresh/rotation can be added for long sessions.
