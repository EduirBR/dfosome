const BASE_API = 'https://api.dfoneople.com'

export default async function handler(req, res) {
  const apiKey = process.env.DFO_API_KEY
  if (!apiKey) {
    res.status(500).json({
      error: { code: 'NO_API_KEY', message: 'DFO_API_KEY is not configured' },
    })
    return
  }

  try {
    const slug = String(req.query.slug || []).split(',')
    const path = slug.join('/')
    const qsIndex = req.url.indexOf('?')
    const query = qsIndex >= 0 ? req.url.slice(qsIndex) : ''

    const headers = { apikey: apiKey }
    if (req.headers['content-type']) {
      headers['content-type'] = req.headers['content-type']
    }

    const isBodyless = req.method === 'GET' || req.method === 'HEAD'
    const upstream = await fetch(`${BASE_API}/df/${path}${query}`, {
      method: req.method,
      headers,
      body: isBodyless ? undefined : JSON.stringify(req.body || {}),
    })

    const text = await upstream.text()
    const contentType = upstream.headers.get('content-type') || ''
    res.status(upstream.status)
    if (contentType) res.setHeader('content-type', contentType)
    res.send(text)
  } catch (err) {
    res.status(502).json({
      error: { code: 'PROXY_ERROR', message: String(err) },
    })
  }
}