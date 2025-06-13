import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store";
import "./CartModal.css";

function CartModal({ selectedItem, closeModal }) {
	const dispatch = useDispatch();
	const [selectedModifiers, setSelectedModifiers] = useState({});

	// Reset selectedModifiers every time a new item is selected
	useEffect(() => {
		setSelectedModifiers({});
	}, [selectedItem]);

	if (!selectedItem) return null;

	// Debug logging
	console.log("Selected Item:", selectedItem);
	console.log("Modifier Groups:", selectedItem.modifierGroups);

	let filteredModifierGroups = selectedItem.modifierGroups;
	if (selectedItem.label.toLowerCase() === "burger") {
		// Show all modifier groups for burger
		filteredModifierGroups = selectedItem.modifierGroups;
		console.log("Burger Modifier Groups:", filteredModifierGroups);
	} else if (selectedItem.label.toLowerCase() === "pizza") {
		// Show only toppings for pizza
		filteredModifierGroups = selectedItem.modifierGroups.filter(
			(group) => group.label.toLowerCase() === "toppings"
		);
	} else {
		// Default: show all
		filteredModifierGroups = selectedItem.modifierGroups;
	}

	// Debug logging for filtered groups
	console.log("Filtered Modifier Groups:", filteredModifierGroups);

	const handleModifierChange = (groupId, modifierId, checked) => {
		setSelectedModifiers((prev) => ({
			...prev,
			[groupId]: checked
				? [...(prev[groupId] || []), modifierId]
				: (prev[groupId] || []).filter((id) => id !== modifierId),
		}));
	};

	const handleAddToCart = () => {
		dispatch(
			addToCart({
				...selectedItem,
				selectedModifiers,
			})
		);
		closeModal();
	};

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2 className="modal-title">Add to Cart</h2>
				<div className="modal-item-details">
					<h3>{selectedItem.label}</h3>
					<p className="item-price">${selectedItem.price?.toFixed(2)}</p>
				</div>

				{filteredModifierGroups?.map((group) => {
					// Debug logging for each group
					console.log(
						"Rendering group:",
						group.label,
						"with modifiers:",
						group.modifiers
					);
					return (
						<div key={group.id} className="modal-modifier-group">
							<h4>{group.label}</h4>
							<div className="modifier-options">
								{group.modifiers.map((modifier) => (
									<label key={modifier.id} className="modifier-option">
										<input
											type="checkbox"
											checked={selectedModifiers[group.id]?.includes(
												modifier.id
											)}
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
					);
				})}

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
