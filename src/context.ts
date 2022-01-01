import { PrismaClient } from '@prisma/client'
// @ts-ignore
// import { createPubSub } from 'graphql-yoga';

// const pubsub: any = createPubSub();

// export interface Context {
//   prisma: PrismaClient;
// }

const db = new PrismaClient()

export const context = {
  db,
}
