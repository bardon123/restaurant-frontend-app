import React from "react";
import { useCart } from "../context/CartContext";
import "./CartModal.css";

function getItemTotal(item) {
	let total = item.price || 0;
	if (item.selectedModifiers && item.modifierGroups) {
		Object.entries(item.selectedModifiers).forEach(([groupId, modifierIds]) => {
			for (const group of item.modifierGroups) {
				if (group.id === groupId) {
					for (const modId of modifierIds) {
						const mod = group.modifiers.find((m) => m.id === modId);
						if (mod && mod.item && mod.item.price) {
							total += mod.item.price;
						}
					}
				}
			}
		});
	}
	return total;
}

function CartItemsModal() {
	const { cart, isCartModalOpen, closeCartModal, clearCart } = useCart();

	// Calculate grand total
	const grandTotal = cart.reduce((sum, item) => sum + getItemTotal(item), 0);

	if (!isCartModalOpen) return null;

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2 className="modal-title">Your Cart</h2>
				{cart.length === 0 ? (
					<p style={{ textAlign: "center", color: "#FFD700" }}>
						Your cart is empty.
					</p>
				) : (
					<ul style={{ listStyle: "none", padding: 0 }}>
						{cart.map((item, idx) => (
							<li
								key={idx}
								style={{
									marginBottom: "1.5rem",
									borderBottom: "1px solid #FFD700",
									paddingBottom: "1rem",
								}}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}>
									<span
										style={{
											fontWeight: "bold",
											fontSize: "1.1rem",
											color: "#FFD700",
										}}>
										{item.label}
									</span>
									<span className="item-price">
										${getItemTotal(item).toFixed(2)}
									</span>
								</div>
								{item.selectedModifiers &&
									Object.keys(item.selectedModifiers).length > 0 && (
										<div style={{ marginTop: "0.5rem", marginLeft: 0 }}>
											{Object.entries(item.selectedModifiers).map(
												([groupId, modifierIds]) => {
													// Gather all selected modifiers for this group
													const selectedMods = (item.modifierGroups || [])
														.filter((group) => group.id === groupId)
														.flatMap((group) =>
															group.modifiers.filter((mod) =>
																modifierIds.includes(mod.id)
															)
														);
													if (selectedMods.length === 0) return null;
													return (
														<div
															key={groupId}
															style={{
																display: "flex",
																alignItems: "center",
																justifyContent: "space-between",
																marginBottom: "0.3rem",
																gap: "1rem",
															}}>
															<span
																style={{
																	fontSize: "0.8rem",
																	color: "#FFD700",
																	minWidth: 60,
																}}>
																Extras:
															</span>
															<div
																style={{
																	display: "flex",
																	gap: "0.7rem",
																	flexWrap: "wrap",
																	justifyContent: "flex-end",
																	flex: 1,
																}}>
																{selectedMods.map((mod) => (
																	<span
																		key={mod.id}
																		style={{
																			display: "flex",
																			alignItems: "center",
																			fontSize: "0.9rem",
																			color: "#FFD700",
																		}}>
																		<span>{mod.label}</span>
																		{mod.item?.price > 0 && (
																			<span
																				className="modifier-price"
																				style={{ marginLeft: "0.5rem" }}>
																				+${mod.item.price.toFixed(2)}
																			</span>
																		)}
																	</span>
																))}
															</div>
														</div>
													);
												}
											)}
										</div>
									)}
							</li>
						))}
					</ul>
				)}
				{/* Grand Total */}
				{cart.length > 0 && (
					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							alignItems: "center",
							marginTop: "1.5rem",
							fontWeight: "bold",
							fontSize: "1.2rem",
							color: "#FFD700",
						}}>
						<span style={{ marginRight: "1.5rem" }}>Total:</span>
						<span className="item-price">${grandTotal.toFixed(2)}</span>
					</div>
				)}
				<div className="modal-actions">
					<button className="cancel-button" onClick={closeCartModal}>
						Close
					</button>
					{cart.length > 0 && (
						<button className="confirm-button" onClick={clearCart}>
							Clear Cart
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default CartItemsModal;
