
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import PortfolioItem from '@/models/PortfolioItem';
import authMiddleware, { NextApiRequestWithUser } from '@/middleware/auth';

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  if (req.method === 'POST') {
    await dbConnect();
    try {
      // Ensure only the authenticated user (you) can create items
      // For a single-user portfolio, we don't need to link to userId
      // but the authMiddleware ensures only you can make this request.
      const portfolioItem = await PortfolioItem.create(req.body);
      res.status(201).json({ success: true, data: portfolioItem });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default authMiddleware(handler);
