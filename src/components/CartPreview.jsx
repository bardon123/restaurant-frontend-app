import React from "react";
import { useSelector } from "react-redux";
import "./CartPreview.css";

function CartPreview({ onOpenCartModal }) {
	const cart = useSelector((state) => state.cart.items);
	const itemCount = cart.length;

	return (
		<button
			className="cart-preview"
			onClick={onOpenCartModal}
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
