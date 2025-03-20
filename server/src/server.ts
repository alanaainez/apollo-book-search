import express, { Application } from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import db from './config/connection.js';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js'
import routes from './routes/index.js';

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  
  app.use('/graphql', expressMiddleware(server, { context: async() => ({}) }));


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => 
    console.log(`🌍 Now listening on localhost:${PORT}`));
});
}

startServer();
