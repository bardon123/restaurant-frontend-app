import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../store";
import { useMutation, gql } from "@apollo/client";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import OrderReceiptModal from "./OrderReceiptModal";
import PaymentModal from "./PaymentModal";
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

export default function CartItemsModal({ isCartModalOpen, onCloseCartModal }) {
	const cart = useSelector((state) => state.cart.items);
	const token = useSelector((state) => state.auth.token);
	const dispatch = useDispatch();
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [showLogin, setShowLogin] = useState(true);
	const [orderSuccess, setOrderSuccess] = useState(false);
	const [orderError, setOrderError] = useState("");
	const [orderReceipt, setOrderReceipt] = useState(null);
	const [showPaymentModal, setShowPaymentModal] = useState(false);

	// Calculate grand total
	const grandTotal = cart.reduce((sum, item) => sum + getItemTotal(item), 0);

	const handleCheckout = () => {
		if (!token) {
			setShowAuthModal(true);
			return;
		}
		setShowPaymentModal(true);
	};

	useEffect(() => {
		console.log("token changed", token, showAuthModal);
		if (token && showAuthModal) {
			setShowAuthModal(false);
		}
	}, [token, showAuthModal]);

	// Hide cart modal when showing receipt
	if (orderReceipt) {
		return (
			<OrderReceiptModal
				order={orderReceipt}
				items={cart}
				onClose={() => {
					setOrderReceipt(null);
					setOrderSuccess(false);
					setOrderError("");
					onCloseCartModal();
				}}
			/>
		);
	}

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
					<button className="cancel-button" onClick={onCloseCartModal}>
						Close
					</button>
					{cart.length > 0 && (
						<>
							<button
								className="confirm-button"
								onClick={() => dispatch(clearCart())}>
								Clear Cart
							</button>
							<button className="confirm-button" onClick={handleCheckout}>
								Checkout
							</button>
						</>
					)}
				</div>
				{/* Order Success/Error */}
				{orderSuccess && !orderReceipt && (
					<div className="auth-success" style={{ marginTop: "1rem" }}>
						Order placed successfully!
					</div>
				)}
				{orderError && (
					<div className="auth-error" style={{ marginTop: "1rem" }}>
						{orderError}
					</div>
				)}
				{/* Auth Modal for Checkout */}
				{showAuthModal && (
					<div className="modal-overlay">
						<div className="modal-content" style={{ maxWidth: 400 }}>
							<button
								className="cancel-button"
								style={{ float: "right", marginBottom: "1rem" }}
								onClick={() => setShowAuthModal(false)}>
								Close
							</button>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									gap: "1rem",
									marginBottom: "1rem",
								}}>
								<button
									className="nav-link"
									style={{ fontSize: "0.8rem" }}
									onClick={() => setShowLogin(true)}>
									Login
								</button>
								<button
									className="nav-link"
									style={{ fontSize: "0.8rem" }}
									onClick={() => setShowLogin(false)}>
									Register
								</button>
							</div>
							{showLogin ? (
								<LoginForm onSuccess={() => setShowAuthModal(false)} />
							) : (
								<RegisterForm onSuccess={() => setShowAuthModal(false)} />
							)}
						</div>
					</div>
				)}
				<PaymentModal
					isOpen={showPaymentModal}
					onClose={() => setShowPaymentModal(false)}
					cartItems={cart}
					grandTotal={grandTotal}
					onPaymentSuccess={(order) => {
						setOrderReceipt(order);
						setShowPaymentModal(false);
						dispatch(clearCart());
					}}
				/>
			</div>
		</div>
	);
}
