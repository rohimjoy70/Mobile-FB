import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";

const httpLink = createHttpLink({
   uri: "https://fb-darkmode.tobangado.site/",
});

const authLink = setContext(async (_, { headers }) => {
   // get the authentication token from local storage if it exists
   const token = await SecureStore.getItemAsync("access_token");
   // const username = await SecureStore.getItemAsync("username");
   // console.log({ token, username }, "<<<<<<<< dari config apolo");
   // return the headers to the context so httpLink can read them
   return {
      headers: {
         ...headers,
         authorization: token ? `Bearer ${token}` : "",
      },
   };
});

const client = new ApolloClient({
   link: authLink.concat(httpLink),
   cache: new InMemoryCache(),
});

export default client;
