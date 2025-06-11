import React from "react";
import { useCart } from "../context/CartContext";
import "./CartPreview.css";

function CartPreview() {
	const { cart, openCartModal } = useCart();
	const itemCount = cart.length;

	return (
		<button
			className="cart-preview"
			onClick={openCartModal}
			aria-label="View cart">
			<img
				src={process.env.PUBLIC_URL + "/assets/svgs/pokeball_icon.png"}
				alt="Cart"
				className="cart-icon"
			/>
			{itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
		</button>
	);
}

export default CartPreview;
