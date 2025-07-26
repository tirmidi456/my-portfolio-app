import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import PortfolioItem from '@/models/PortfolioItem';
import authMiddleware, { NextApiRequestWithUser } from '@/middleware/auth';

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  const { query: { id }, method } = req;

  await dbConnect();

  if (method === 'DELETE') {
    try {
      const deletedItem = await PortfolioItem.deleteOne({ _id: id });

      if (deletedItem.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'Portfolio item not found.' });
      }

      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default authMiddleware(handler);