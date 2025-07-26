
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export interface NextApiRequestWithUser extends NextApiRequest {
  userId?: string;
}

const authMiddleware = (
  handler: (req: NextApiRequestWithUser, res: NextApiResponse) => void
) => {
  return async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    const token = authorization.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
      req.userId = decoded.userId;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
  };
};

export default authMiddleware;
