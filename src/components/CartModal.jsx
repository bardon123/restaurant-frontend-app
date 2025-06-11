import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import "./CartModal.css";

function filterModifiers(item) {
	// For Pizza: only show 'Extra Cheese'
	if (item.label.toLowerCase() === "pizza") {
		return item.modifierGroups
			?.map((group) => ({
				...group,
				modifiers: group.modifiers.filter(
					(mod) => mod.label.toLowerCase() === "extra cheese"
				),
			}))
			.filter((group) => group.modifiers.length > 0);
	}
	// For Burger: show all extras (no filtering)
	if (item.label.toLowerCase() === "burger") {
		return item.modifierGroups;
	}
	// Default: show all
	return item.modifierGroups;
}

function CartModal() {
	const { selectedItem, addToCart, closeModal } = useCart();
	const [selectedModifiers, setSelectedModifiers] = useState({});

	// Reset selectedModifiers every time a new item is selected
	useEffect(() => {
		setSelectedModifiers({});
	}, [selectedItem]);

	if (!selectedItem) return null;

	const filteredModifierGroups = filterModifiers(selectedItem);

	const handleModifierChange = (groupId, modifierId, checked) => {
		setSelectedModifiers((prev) => ({
			...prev,
			[groupId]: checked
				? [...(prev[groupId] || []), modifierId]
				: (prev[groupId] || []).filter((id) => id !== modifierId),
		}));
	};

	const handleAddToCart = () => {
		addToCart(selectedItem, selectedModifiers);
	};

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2 className="modal-title">Add to Cart</h2>
				<div className="modal-item-details">
					<h3>{selectedItem.label}</h3>
					<p className="item-price">${selectedItem.price?.toFixed(2)}</p>
				</div>

				{filteredModifierGroups?.map((group) => (
					<div key={group.id} className="modal-modifier-group">
						<h4>{group.label}</h4>
						<div className="modifier-options">
							{group.modifiers.map((modifier) => (
								<label key={modifier.id} className="modifier-option">
									<input
										type="checkbox"
										checked={selectedModifiers[group.id]?.includes(modifier.id)}
										onChange={(e) =>
											handleModifierChange(
												group.id,
												modifier.id,
												e.target.checked
											)
										}
									/>
									<span className="modifier-label">{modifier.label}</span>
									{modifier.item?.price > 0 && (
										<span className="modifier-price">
											+${modifier.item.price.toFixed(2)}
										</span>
									)}
								</label>
							))}
						</div>
					</div>
				))}

				<div className="modal-actions">
					<button className="cancel-button" onClick={closeModal}>
						Cancel
					</button>
					<button className="confirm-button" onClick={handleAddToCart}>
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
}

export default CartModal;
