import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleScalevWebhook } from '../_scalevWebhookCore.js';

const getHeaderMap = (req: VercelRequest) => ({
  authorization: typeof req.headers.authorization === 'string' ? req.headers.authorization : undefined,
  'x-webhook-key':
    typeof req.headers['x-webhook-key'] === 'string' ? req.headers['x-webhook-key'] : undefined,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const bodyText =
    typeof req.body === 'string'
      ? req.body
      : JSON.stringify(req.body || {});

  const result = await handleScalevWebhook({
    method: req.method || 'GET',
    queryKey: typeof req.query.key === 'string' ? req.query.key : '',
    headers: getHeaderMap(req),
    bodyText,
  });

  return res.status(result.status).json(result.body);
}
