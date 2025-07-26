import type { NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import authMiddleware, { NextApiRequestWithUser } from '@/middleware/auth';

const handler = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await User.findById(userId).select('-password'); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ username: user.username, createdAt: user.createdAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default authMiddleware(handler);
