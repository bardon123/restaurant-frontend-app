import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
	uri: "https://menu-query.onrender.com/graphql",
	credentials: "include",
	headers: {
		"Content-Type": "application/json",
	},
});

const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: "network-only",
		},
	},
});

export default client;
