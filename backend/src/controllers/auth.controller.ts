import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma'
import { createError } from '../middleware/error.middleware'

// Generate JWT token
const generateToken = (id: string, email: string, role: string) => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// ===== REGISTER =====
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phone, password } = req.body

    if (!name || !email || !password) {
      return next(createError('Name, email and password are required', 400))
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return next(createError('Email already registered', 400))
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: { name, email, phone, password: hashedPassword },
      select: { id: true, name: true, email: true, phone: true, role: true }
    })

    const token = generateToken(user.id, user.email, user.role)

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user,
    })
  } catch (error) {
    next(error)
  }
}

// ===== LOGIN =====
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(createError('Email and password are required', 400))
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return next(createError('Invalid email or password', 401))
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return next(createError('Invalid email or password', 401))
    }

    const token = generateToken(user.id, user.email, user.role)

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// ===== GET PROFILE =====
export const getProfile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }
    })

    if (!user) return next(createError('User not found', 404))

    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}
