
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import PortfolioItem from '@/models/PortfolioItem';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query: { id }, method } = req;

  await dbConnect();

  if (method === 'GET') {
    try {
      const portfolioItem = await PortfolioItem.findById(id);
      if (!portfolioItem) {
        return res.status(404).json({ success: false, message: 'Portfolio item not found.' });
      }
      res.status(200).json({ success: true, data: portfolioItem });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
