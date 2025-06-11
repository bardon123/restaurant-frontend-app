import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
	const [cart, setCart] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [isCartModalOpen, setIsCartModalOpen] = useState(false);

	const addToCart = (item, selectedModifiers) => {
		setCart([...cart, { ...item, selectedModifiers }]);
		setIsModalOpen(false);
		setSelectedItem(null);
	};

	const openAddToCartModal = (item) => {
		setSelectedItem(item);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedItem(null);
	};

	const openCartModal = () => setIsCartModalOpen(true);
	const closeCartModal = () => setIsCartModalOpen(false);

	const clearCart = () => {
		setCart([]);
		setIsCartModalOpen(false);
	};

	return (
		<CartContext.Provider
			value={{
				cart,
				addToCart,
				isModalOpen,
				selectedItem,
				openAddToCartModal,
				closeModal,
				isCartModalOpen,
				openCartModal,
				closeCartModal,
				clearCart,
			}}>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
