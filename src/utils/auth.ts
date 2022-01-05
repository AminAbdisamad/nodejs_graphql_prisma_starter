import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'

export const ACCESS_KEY = process.env.SECRET_KEY as string
const REFRESH_KEY = process.env.REFRESH_KEY as string

export const getUserId = async (req: any) => {
  // Get Authorization header
  const header = req.req.headers.authorization

  if (!header) throw new Error('Auth required to access resource')
  const token: string = header.replace('Bearer ', '')

  //Get User provided Token
  const userId = await jwt.verify(token, ACCESS_KEY)
  return userId
}

export const createRefreshToken = (user: User) => {
  return jwt.sign({ userId: user.id }, REFRESH_KEY, { expiresIn: '7d' })
}

export const createAccessToken = (user: User) => {
  return jwt.sign({ userId: user.id }, ACCESS_KEY, { expiresIn: '30m' })
}
