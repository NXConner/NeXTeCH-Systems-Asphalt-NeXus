import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { bounds } = req.query;

  if (!bounds) {
    return res.status(400).json({ error: 'Missing bounds parameter' });
  }

  try {
    const { north, south, east, west } = JSON.parse(bounds as string);
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/box/city?bbox=${west},${south},${east},${north},10&appid=${apiKey}`
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
} 