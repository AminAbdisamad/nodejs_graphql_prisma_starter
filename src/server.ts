// @ts-ignore
// import { createServer } from 'graphql-yoga';
import { readFileSync } from 'fs'
import { context } from './context'
import { ApolloServer, gql } from 'apollo-server'

// we must convert the file Buffer to a UTF-8 string
const typeDefs = readFileSync('./src/schema.graphql').toString('utf-8')

import { Mutation } from './Mutation'
import { Query } from './Query'

const resolvers = { Mutation, Query }

const server = new ApolloServer({ resolvers, typeDefs, context })

// The `listen` method launches a web server.
server.listen().then(({ url }: any) => {
  console.log(`🚀  Server ready at ${url}`)
})
