import { configureStore, createSlice } from "@reduxjs/toolkit";

// Auth slice
const initialAuthState = {
	token: localStorage.getItem("token") || "",
	client: localStorage.getItem("client") || "",
	uid: localStorage.getItem("uid") || "",
	user: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState: initialAuthState,
	reducers: {
		login: (state, action) => {
			const { token, client, uid, user } = action.payload;
			state.token = token;
			state.client = client;
			state.uid = uid;
			state.user = user || null;
			localStorage.setItem("token", token);
			localStorage.setItem("client", client);
			localStorage.setItem("uid", uid);
		},
		logout: (state) => {
			state.token = "";
			state.client = "";
			state.uid = "";
			state.user = null;
			localStorage.removeItem("token");
			localStorage.removeItem("client");
			localStorage.removeItem("uid");
		},
	},
});

// Cart slice
const initialCartState = {
	items: [],
};

const cartSlice = createSlice({
	name: "cart",
	initialState: initialCartState,
	reducers: {
		setCart: (state, action) => {
			state.items = action.payload;
		},
		clearCart: (state) => {
			state.items = [];
		},
		addToCart: (state, action) => {
			state.items.push(action.payload);
		},
		removeFromCart: (state, action) => {
			state.items = state.items.filter((item, idx) => idx !== action.payload);
		},
	},
});

export const { login, logout } = authSlice.actions;
export const { setCart, clearCart, addToCart, removeFromCart } =
	cartSlice.actions;

const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		cart: cartSlice.reducer,
	},
});

export default store;
