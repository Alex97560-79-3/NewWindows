import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const requireRole = (roles: string | string[]) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole) return res.status(403).json({ error: 'No role' });
    if (!allowed.includes(userRole)) return res.status(403).json({ error: 'Forbidden: insufficient role' });
    next();
    console.log(req.user)
  };
};
