import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import SearchBooks from './pages/SearchBooks';  // Import your search page

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql', // Change this when deploying
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <SearchBooks />
    </ApolloProvider>
  );
}

export default App;
