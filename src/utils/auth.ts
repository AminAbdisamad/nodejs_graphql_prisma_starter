import jwt from 'jsonwebtoken'
export const getUserId = async (req: any) => {
  // Get Authorization header
  const header = req.req.headers.authorization
  const SECRET = process.env.SECRET_KEY as string
  if (!header) throw new Error('Auth required to access resource')
  const token: string = header.replace('Bearer ', '')

  //Get User provided Token
  const userId = await jwt.verify(token, SECRET)
  return userId
}
