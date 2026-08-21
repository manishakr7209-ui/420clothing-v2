import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { createError } from './error.middleware'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

// Verify JWT token
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError('Not authorized — no token', 401))
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
      email: string
      role: string
    }

    req.user = decoded
    next()
  } catch (error) {
    next(createError('Not authorized — invalid token', 401))
  }
}

// Only allow admin or developer
export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !['ADMIN', 'DEVELOPER'].includes(req.user.role)) {
    return next(createError('Access denied — admins only', 403))
  }
  next()
}

// Only allow developer
export const developerOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'DEVELOPER') {
    return next(createError('Access denied — developers only', 403))
  }
  next()
}
