import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
// Import the ApolloServer class
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
// Import the two parts of a GraphQL schema
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';

const PORT = process.env.PORT || 3001;

const app = express();


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Apply Apollo Server middleware
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: authenticateToken
    })
  );



  if (process.env.NODE_ENV === 'production') {
    // Serve static files
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    // Handle client routing
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`GraphQL available at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();