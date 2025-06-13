import React from "react";
import "./CartModal.css";

export default function OrderReceiptModal({ order, items, onClose }) {
	if (!order) return null;

	// Calculate subtotal (sum of all item and modifier prices)
	const subtotal = order.orderItems.reduce((sum, orderItem) => {
		let itemTotal = (orderItem.price || 0) * (orderItem.quantity || 1);
		if (orderItem.modifiers && orderItem.modifiers.length > 0) {
			itemTotal += orderItem.modifiers.reduce((modSum, mod) => {
				const modPrice =
					typeof mod.price === "number" ? mod.price : mod.item?.price ?? 0;
				return modSum + modPrice * (orderItem.quantity || 1);
			}, 0);
		}
		return sum + itemTotal;
	}, 0);

	// Discount = subtotal - order.totalPrice
	const discount = subtotal - (order.totalPrice || 0);

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2 className="modal-title">Order Confirmation</h2>
				<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
					<div
						style={{
							fontWeight: "bold",
							fontSize: "1.1rem",
							color: "#FFD700",
						}}>
						Order #{order.id}
					</div>
				</div>
				<div className="order-summary">
					<h3 className="summary-title">Items</h3>
					<div className="receipt">
						{order.orderItems.map((orderItem) => (
							<div key={orderItem.id} className="receipt-item">
								<div className="receipt-item-header">
									<span className="item-name">
										{orderItem.item.label} × {orderItem.quantity}
									</span>
									<span
										className="item-price"
										style={{ color: "#FFD700", fontWeight: "bold" }}>
										${orderItem.price?.toFixed(2)}
									</span>
								</div>
								{orderItem.modifiers && orderItem.modifiers.length > 0 && (
									<div>
										{orderItem.modifiers.map((mod) => {
											const modPrice =
												typeof mod.price === "number"
													? mod.price
													: mod.item?.price ?? 0;
											return (
												<div key={mod.id} className="receipt-modifier">
													<span className="modifier-name">+ {mod.label}</span>
													<span
														className="modifier-price"
														style={{
															color: "#FFD700",
															fontWeight: "bold",
															marginLeft: "0.5rem",
															background: "none",
															border: "none",
															padding: 0,
														}}>
														${modPrice.toFixed(2)}
													</span>
												</div>
											);
										})}
									</div>
								)}
							</div>
						))}
						<div className="receipt-subtotal">
							<span>Subtotal:</span>
							<span>${subtotal.toFixed(2)}</span>
						</div>
						{discount > 0 && (
							<div className="receipt-discount">
								<span>Discount:</span>
								<span>- ${discount.toFixed(2)}</span>
							</div>
						)}
						<div className="receipt-total">
							<span>Total:</span>
							<span style={{ color: "#FFD700", fontWeight: "bold" }}>
								${order.totalPrice?.toFixed(2) ?? "0.00"}
							</span>
						</div>
					</div>
				</div>
				<div className="modal-actions">
					<button className="confirm-button" onClick={onClose}>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
