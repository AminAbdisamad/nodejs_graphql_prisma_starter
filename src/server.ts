// @ts-ignore
// import { createServer } from 'graphql-yoga';
import Express from 'express'
import Cors from 'cors'
import { readFileSync } from 'fs'
import { context } from './context'
import { ApolloServer, gql } from 'apollo-server-express'

// we must convert the file Buffer to a UTF-8 string
const typeDefs = readFileSync('./src/schema.graphql').toString('utf-8')

import { Mutation } from './Mutation'
import { Query } from './Query'

const resolvers = { Mutation, Query }

async function StartApolloServer() {
  // Express App
  const app = Express()

  // CORS configuration
  const corsOptions = {
    origin: 'http://localhost:3000',
    // && 'http://localhost:4000/graphql',
    // origin: '*',
    credentials: true,
  }

  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context,
  })
  await server.start()
  server.applyMiddleware({ app, cors: corsOptions })

  // Enable Cors

  // app.use(Cors())
  // Express Server
  app.use((req, res) => {
    res.send('Welcome to Apollo Express GrapQL Api')
  })

  // GraphQL Server
  app.listen(4000, () => {
    console.log(`Server Running on port 4000...`)
  })
}
StartApolloServer()
