import { generateSample } from '../../lib/temperature.cjs';

export default function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json(generateSample());
}
