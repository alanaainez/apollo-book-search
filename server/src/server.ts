import express from 'express';
import path from 'node:path';
import type { Request, Response, NextFunction } from 'express';
// Import the ApolloServer class
import { ApolloServer } from '@apollo/server';
// Import the two parts of a GraphQL schema
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  },
  introspection: process.env.NODE_ENV !== 'production',
});

const app = express();

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();
  await db;

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.CLIENT_URL || 'https://your-production-domain.com'
      : 'http://localhost:3000',
    credentials: true
  }));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Error handling middleware
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


  if (process.env.NODE_ENV === 'production') {
    // Serve static files
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    // Handle client routing
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'healthy' });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`GraphQL available at http://localhost:${PORT}/graphql`);
  });
};

// Call the async function to start the server
startApolloServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});