import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import db from './config/connection.js';
import { authenticateToken } from './services/auth.js';
import { typeDefs, resolvers } from './schemas/index.js'  
import type { Request, Response } from 'express';


interface MyContext {
  _id?: String;
}

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  db;

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(express.urlencoded({extended: true}));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server as any,
  {
    context: authenticateToken as any
    //context: async ({ req }) => ({ token: req.headers.token }),
  }
  ));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
