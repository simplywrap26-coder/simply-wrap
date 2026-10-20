// Vercel serverless function. Runs on the server, so the Admin token never reaches the browser.
// Needs env vars (NOT prefixed VITE_): SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_TOKEN (scope: write_customers).
const MUTATION = `mutation($input: CustomerInput!){ customerCreate(input:$input){ customer{ id } userErrors{ field message } } }`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const allowed = process.env.ALLOWED_ORIGIN;
  if (allowed && req.headers.origin !== allowed) return res.status(403).json({ error: 'Forbidden.' });

  const { email, company } = req.body ?? {};
  if (company) return res.status(200).json({ ok: true }); // bots fill the honeypot; pretend success
  if (typeof email !== 'string' || email.length > 254 || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });

  const domain = process.env.SHOPIFY_STORE_DOMAIN, token = process.env.SHOPIFY_ADMIN_TOKEN;
  const version = process.env.SHOPIFY_API_VERSION ?? '2025-01';
  if (!domain || !token) return res.status(500).json({ error: 'Newsletter is not configured.' });

  try {
    const r = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query: MUTATION, variables: { input: {
        email, tags: ['newsletter'],
        emailMarketingConsent: { marketingState: 'SUBSCRIBED', marketingOptInLevel: 'SINGLE_OPT_IN', consentUpdatedAt: new Date().toISOString() },
      } } }),
    });
    const json: any = await r.json();
    const errs: { message: string }[] = json?.data?.customerCreate?.userErrors ?? [];
    const alreadyExists = errs.some((e) => /taken/i.test(e.message));
    if (json.errors || (errs.length && !alreadyExists)) return res.status(502).json({ error: 'Could not subscribe right now. Please try again later.' });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'Could not subscribe right now. Please try again later.' });
  }
}
