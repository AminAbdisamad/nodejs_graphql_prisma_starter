import { ContextType } from './context'
import { DBType } from './types'
export const Query = {
  users: (_parent: any, _args: any, { db, res }: ContextType) => {
    const users = db.user.findMany({ include: { posts: true } })

    return users
  },

  user: async (_parent: any, args: any, { db }: DBType) => {
    const parsedID = parseInt(args.id)

    const user = await db.user.findUnique({
      where: { id: parsedID },
      include: { posts: true },
    })
    const postCount = user?.posts.length
    console.log(` ${user?.username} has ${postCount} posts`)
    if (!user) throw new Error('user not found')
    return user
  },

  // Posts
  post: async (_parent: any, args: any, { db }: DBType) => {
    const parsedID = parseInt(args.id)

    const post = await db.post.findUnique({ where: { id: parsedID } })
    if (!post) throw new Error('Post not found')
    return post
  },
  posts: async (_parent: any, _args: any, { db }: DBType) => {
    return await db.post.findMany({ include: { author: true } })
  },
}
