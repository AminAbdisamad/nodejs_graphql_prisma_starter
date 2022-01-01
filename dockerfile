FROM node:16-alpine
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# Add Prisma client build
COPY prisma/schema.prisma ./prisma
RUN npx prisma generate
COPY . .
RUN yarn build
EXPOSE 8080
CMD ["yarn","start"]
