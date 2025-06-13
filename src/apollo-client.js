import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
	uri: "https://menu-query.onrender.com/graphql",
	credentials: "include",
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem("token");
	const client = localStorage.getItem("client");
	const uid = localStorage.getItem("uid");
	return {
		headers: {
			...headers,
			...(token && client && uid
				? {
						"access-token": token,
						client: client,
						uid: uid,
				  }
				: {}),
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: "network-only",
		},
	},
});

export default client;
