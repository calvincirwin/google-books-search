const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const cors = require('cors');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// ✅ Set up Apollo Server with Apollo Sandbox enabled
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true // ✅ Ensures Apollo Sandbox always works
});

// ✅ Start Apollo Server
async function startApolloServer() {
  await server.start();
  app.use('/graphql', expressMiddleware(server, { context: authMiddleware })); // ✅ Apply authMiddleware

  // ✅ Serve React frontend in production
  if (process.env.NODE_ENV === 'production') {
    console.log('🚀 Serving frontend from client/dist/');
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      console.log('🔍 Serving index.html from client/dist/');
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  } else {
    console.log('⚠️ Running in development mode - Frontend not served');
    console.log('🚀 GraphQL API running! Open Apollo Sandbox:');
    console.log('🔗 https://studio.apollographql.com/sandbox/explorer');
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Server running on http://localhost:${PORT}`);
      console.log(`🚀 GraphQL API available at http://localhost:${PORT}/graphql`);
    });
  });
}

// ✅ Start the server
startApolloServer();
