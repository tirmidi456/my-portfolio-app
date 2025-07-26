import type { NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import authMiddleware, { NextApiRequestWithUser } from '@/middleware/auth';

const handler = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse
) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  const { username, password, currentPassword } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!currentPassword) {
    return res.status(400).json({ message: 'Current password is required to update user information' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ message: 'Username already taken' });
      }
      user.username = username;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({ username: user.username, createdAt: user.createdAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default authMiddleware(handler);
