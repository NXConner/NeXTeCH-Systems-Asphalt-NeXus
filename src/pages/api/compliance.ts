import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { bounds } = req.query;

  if (!bounds) {
    return res.status(400).json({ error: 'Missing bounds parameter' });
  }

  try {
    const { north, south, east, west } = JSON.parse(bounds as string);

    const { data, error } = await supabase
      .from('compliance_data')
      .select('*')
      .gte('lat', south)
      .lte('lat', north)
      .gte('lng', west)
      .lte('lng', east);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching compliance data:', error);
    res.status(500).json({ error: 'Failed to fetch compliance data' });
  }
} 