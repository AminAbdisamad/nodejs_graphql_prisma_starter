import bycript from 'bcryptjs'
import jwt from 'jsonwebtoken'
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
    { db }: DBType,
  ) => {
    // Get user with that email
    const user = await db.user.findUnique({ where: { email: args.email } })
    if (!user) throw new Error('User Email NOT Found')
    // Decode User Password
    const isMatch = await bycript.compare(args.password, user.password)
    if (!isMatch) throw new Error('Incorrect email or password')
    return { user, token: 'token' }
  },
  // User Mutation
  createUser: async (
    _: any,
    { data }: { data: CreateUserInput },
    { db }: DBType,
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
    const token = jwt.sign({ userId: user.id }, 'thisisverysecuretoken')
    return { user, token }
  },

  // Update User
  updateUser: async (
    _parent: any,
    { id, data }: { id: string; data: UpdateUserInput },
    { db }: DBType,
  ) => {
    const parsedID = parseInt(id)
    // check if the user exist first
    const user = await db.user.findUnique({ where: { id: parsedID } })

    if (!user) throw new Error('No User found to update')
    return await db.user.update({
      where: { id: parsedID },
      data: {
        username: data.username || '',
        email: data.email || '',
        name: data.name,
        password: data.password || '',
      },
    })
  },

  // Delete user
  deleteUser: async (_parent: any, args: any, { db }: DBType) => {
    const id = parseInt(args.id, 10)
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
    { db }: DBType,
  ) => {
    const post = await db.post.create({
      data: {
        title: data.title,
        content: data.content,
        published: data.published || false,
      },
    })
    console.log(post)
    return post
  },

  // Delete Post
  deletePost: async (_parent: any, args: any, { db }: DBType) => {
    const id = parseInt(args.id, 10)
    const post = await db.post.delete({ where: { id } })
    console.log(post)
    if (!post) throw new Error('No post found')
    return post
  },
}
