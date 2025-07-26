
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import PortfolioItem from '@/models/PortfolioItem';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    await dbConnect();
    try {
      const portfolioItems = await PortfolioItem.find({});
      res.status(200).json({ success: true, data: portfolioItems });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
