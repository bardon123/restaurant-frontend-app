import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Menu from "./components/Menu";
import { CartProvider } from "./context/CartContext";
import CartPreview from "./components/CartPreview";
import CartItemsModal from "./components/CartItemsModal";
import "./App.css";

const client = new ApolloClient({
	uri: "https://menu-query.onrender.com/graphql", // Your deployed GraphQL endpoint
	cache: new InMemoryCache(),
});

function App() {
	return (
		<ApolloProvider client={client}>
			<CartProvider>
				<div className="App">
					<Menu />
					<CartPreview />
					<CartItemsModal />
				</div>
			</CartProvider>
		</ApolloProvider>
	);
}

export default App;
