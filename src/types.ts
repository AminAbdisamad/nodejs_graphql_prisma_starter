import { PrismaClient } from 'prisma/prisma-client'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */

export interface DBType {
  db: PrismaClient
}

export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type CreateUserInput = {
  email: Scalars['String']
  name?: InputMaybe<Scalars['String']>
  username: Scalars['String']
  password: Scalars['String']
}

export type UpdateUserInput = {
  email?: string
  name?: string
  username?: string
  password?: string
}

export type CreatePostInput = {
  title: Scalars['String']
  content?: InputMaybe<Scalars['String']>
  published?: InputMaybe<Scalars['Boolean']>
}
