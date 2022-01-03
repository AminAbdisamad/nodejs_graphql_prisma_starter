import { PrismaClient } from '@prisma/client'

// @ts-ignore
// import { createPubSub } from 'graphql-yoga';

// const pubsub: any = createPubSub();

// export interface Context {
//   prisma: PrismaClient;
// }

export interface ContextType {
  db: PrismaClient
  req?: any
}
const db = new PrismaClient()

export const context = async (req: any) => {
  return {
    db,
    req,
  }
}
