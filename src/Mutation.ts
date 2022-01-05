import bycript from 'bcryptjs'
import jwt from 'jsonwebtoken'

import {
  ACCESS_KEY,
  createAccessToken,
  createRefreshToken,
  getUserId,
} from './utils/auth'
import { ContextType } from './context'
import {
  CreateUserInput,
  DBType,
  CreatePostInput,
  UpdateUserInput,
} from './types'

export const Mutation = {
  // Login
  login: async (
    _parent: any,
    args: { email: string; password: string },
    { db, res }: ContextType,
  ) => {
    // Get user with that email

    const user = await db.user.findUnique({ where: { email: args.email } })
    if (!user) throw new Error('Incorrect email or password')
    // Decode User Password
    const isMatch = await bycript.compare(args.password, user.password)
    if (!isMatch) throw new Error('Incorrect email or password')

    // Create Refresh token
    res.cookie('uid', createRefreshToken(user), { httpOnly: true })
    return { user, token: createAccessToken(user) }
  },
  // User Mutation
  createUser: async (
    _: any,
    { data }: { data: CreateUserInput },
    { db }: ContextType,
  ) => {
    // Check if password longer than 8 chars
    if (data.password.length < 8)
      throw new Error('Password should be more than 8 chars')

    // Hashing password
    const password = await bycript.hash(data.password, 10)
    // check if user already exist
    const userExist = await db.user.findUnique({ where: { email: data.email } })

    if (userExist !== null) {
      throw new Error('email already taken please find another')
    }

    const user = await db.user.create({ data: { ...data, password } })
    const token = jwt.sign({ userId: user.id }, ACCESS_KEY)
    return { user, token }
  },

  // Update User
  updateUser: async (
    _parent: any,
    { data }: { data: UpdateUserInput },
    { db, req }: ContextType,
  ) => {
    // const { userId }: any = await getUserId(req)
    // const parsedID = parseInt(userId)
    // check if the user exist first
    const user = await db.user.findUnique({ where: { id: 3 } })

    if (!user) throw new Error('No User found to update')
    // Encrypt password before updating

    const hashedPassword = data.password
      ? await bycript.hash(data.password, 10)
      : undefined
    return await db.user.update({
      where: { id: 3 },
      data: {
        ...data,
        password: hashedPassword,
      },
    })
  },

  // Delete user
  deleteUser: async (_parent: any, { db, req }: ContextType) => {
    // Make sure user have token before accessing this resource
    const { userId }: any = await getUserId(req)
    const id = parseInt(userId, 10)
    const user = await db.user.delete({ where: { id } })
    console.log(user)
    if (!user) throw new Error('No user found')
    return user
  },

  // ** Post Mutation

  // Create Post
  createPost: async (
    _parent: any,
    { data }: { data: CreatePostInput },
    { db, req }: ContextType,
  ) => {
    // Check if user is logged in before creating the post
    const { userId }: any = await getUserId(req)
    const id = parseInt(userId)
    const post = await db.post.create({
      data: {
        title: data.title,
        content: data.content,
        published: data.published || false,
        author: {
          connect: {
            id,
          },
        },
      },
    })
    console.log(post)
    return post
  },

  // Delete Post
  deletePost: async (_parent: any, args: any, { db, req }: ContextType) => {
    const { userId }: any = await getUserId(req)
    const id = parseInt(args.id, 10)
    const post = await db.post.delete({ where: { id } })
    if (!post) throw new Error('No post found')
    return post
  },
}
