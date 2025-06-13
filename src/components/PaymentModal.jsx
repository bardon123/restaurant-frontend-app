import React, { useState } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import "./CartModal.css";

const VALIDATE_PROMO_CODE_QUERY = gql`
	query ValidatePromoCode($code: String!) {
		validatePromoCode(code: $code) {
			code
			discountType
			discountValue
			expiresAt
			usageLimit
			timesUsed
			active
		}
	}
`;

const CREATE_ORDER_MUTATION = gql`
	mutation CreateOrder2($input: CreateOrder2Input!) {
		createOrder2(input: $input) {
			order {
				id
				createdAt
				totalPrice
				orderItems {
					id
					quantity
					price
					item {
						id
						label
						__typename
					}
					modifiers {
						id
						label
						price
					}
					__typename
				}
				__typename
			}
			errors
			__typename
		}
	}
`;

export default function PaymentModal({
	isOpen,
	onClose,
	cartItems,
	grandTotal,
	onPaymentSuccess,
}) {
	const token = useSelector((state) => state.auth.token);
	const [cardName, setCardName] = useState("");
	const [cardNumber, setCardNumber] = useState("");
	const [expiry, setExpiry] = useState("");
	const [cvv, setCvv] = useState("");
	const [billingAddress, setBillingAddress] = useState("");
	const [promoCode, setPromoCode] = useState("");
	const [promoStatus, setPromoStatus] = useState(null);
	const [discount, setDiscount] = useState(0);
	const [finalTotal, setFinalTotal] = useState(grandTotal);
	const [promoDetails, setPromoDetails] = useState(null);
	const [errorMsg, setErrorMsg] = useState("");

	const [validatePromoCode, { loading: promoLoading }] = useLazyQuery(
		VALIDATE_PROMO_CODE_QUERY,
		{
			fetchPolicy: "network-only",
			onCompleted: (data) => {
				if (data.validatePromoCode) {
					setPromoStatus("valid");
					setPromoDetails(data.validatePromoCode);
					let discountAmt = 0;
					if (data.validatePromoCode.discountType === "percent") {
						discountAmt =
							grandTotal * (data.validatePromoCode.discountValue / 100);
					} else if (data.validatePromoCode.discountType === "amount") {
						discountAmt = data.validatePromoCode.discountValue;
					}
					discountAmt = Math.min(discountAmt, grandTotal);
					setDiscount(discountAmt);
					setFinalTotal(grandTotal - discountAmt);
				} else {
					setPromoStatus("invalid");
					setPromoDetails(null);
					setDiscount(0);
					setFinalTotal(grandTotal);
				}
			},
			onError: () => {
				setPromoStatus("invalid");
				setPromoDetails(null);
				setDiscount(0);
				setFinalTotal(grandTotal);
			},
		}
	);

	const [createOrder, { loading: orderLoading }] = useMutation(
		CREATE_ORDER_MUTATION,
		{
			onCompleted: (data) => {
				if (data.createOrder2 && data.createOrder2.order) {
					onPaymentSuccess(data.createOrder2.order);
				} else {
					setErrorMsg(data.createOrder2.errors?.join(", ") || "Order failed");
				}
			},
			onError: (err) => {
				if (err.message.includes("Authentication")) {
					setErrorMsg("Please log in to complete your order");
				} else {
					setErrorMsg(err.message);
				}
			},
		}
	);

	const handleApplyPromo = () => {
		if (!promoCode) return;
		validatePromoCode({ variables: { code: promoCode } });
	};

	const handlePayment = () => {
		setErrorMsg("");

		if (!token) {
			setErrorMsg("Please log in to complete your order");
			return;
		}

		// Mock validation for card fields
		if (!cardName || !cardNumber || !expiry || !cvv || !billingAddress) {
			setErrorMsg("Please fill in all payment and billing fields.");
			return;
		}

		// Prepare order input
		const items = cartItems.map((item) => ({
			itemId: item.id,
			quantity: item.quantity || 1,
			modifierIds: Object.values(item.selectedModifiers || {}).flat(),
		}));

		createOrder({
			variables: {
				input: {
					items,
					promoCode: promoStatus === "valid" ? promoCode : undefined,
				},
			},
		});
	};

	if (!isOpen) return null;

	// Calculate item totals including modifiers
	const getItemTotal = (item) => {
		let total = item.price || 0;
		if (item.selectedModifiers && item.modifierGroups) {
			Object.entries(item.selectedModifiers).forEach(
				([groupId, modifierIds]) => {
					item.modifierGroups.forEach((group) => {
						if (group.id === groupId) {
							modifierIds.forEach((modId) => {
								const mod = group.modifiers.find((m) => m.id === modId);
								if (mod && mod.item && mod.item.price) {
									total += mod.item.price;
								}
							});
						}
					});
				}
			);
		}
		return total;
	};

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2 className="modal-title">Payment</h2>

				{/* Order Summary Section */}
				<div className="order-summary">
					<h3 className="summary-title">Order Summary</h3>
					<div className="receipt">
						{cartItems.map((item, idx) => (
							<div key={idx} className="receipt-item">
								<div className="receipt-item-header">
									<span className="item-name">{item.label}</span>
									<span className="item-price">${item.price?.toFixed(2)}</span>
								</div>
								{item.selectedModifiers &&
									Object.entries(item.selectedModifiers).map(
										([groupId, modifierIds]) => {
											const selectedMods =
												item.modifierGroups
													?.find((group) => group.id === groupId)
													?.modifiers.filter((mod) =>
														modifierIds.includes(mod.id)
													) || [];

											return selectedMods.map((mod) => (
												<div key={mod.id} className="receipt-modifier">
													<span className="modifier-name">+ {mod.label}</span>
													{mod.item?.price > 0 && (
														<span className="modifier-price">
															${mod.item.price.toFixed(2)}
														</span>
													)}
												</div>
											));
										}
									)}
								<div className="receipt-item-total">
									<span>Item Total:</span>
									<span>${getItemTotal(item).toFixed(2)}</span>
								</div>
							</div>
						))}
						<div className="receipt-subtotal">
							<span>Subtotal:</span>
							<span>${grandTotal.toFixed(2)}</span>
						</div>
						{promoStatus === "valid" && (
							<div className="receipt-discount">
								<span>
									Discount (
									{promoDetails.discountType === "percent"
										? `${promoDetails.discountValue}%`
										: "Fixed"}
									):
								</span>
								<span>-${discount.toFixed(2)}</span>
							</div>
						)}
						<div className="receipt-total">
							<span>Total:</span>
							<span>${finalTotal.toFixed(2)}</span>
						</div>
					</div>
				</div>

				{/* Payment Form Section */}
				<form onSubmit={(e) => e.preventDefault()}>
					{!token && (
						<div className="auth-warning">
							Please log in to complete your order
						</div>
					)}
					<input
						value={cardName}
						onChange={(e) => setCardName(e.target.value)}
						placeholder="Cardholder Name"
						className="modal-input"
					/>
					<input
						value={cardNumber}
						onChange={(e) => setCardNumber(e.target.value)}
						placeholder="Card Number"
						className="modal-input"
					/>
					<input
						value={expiry}
						onChange={(e) => setExpiry(e.target.value)}
						placeholder="MM/YY"
						className="modal-input"
					/>
					<input
						value={cvv}
						onChange={(e) => setCvv(e.target.value)}
						placeholder="CVV"
						className="modal-input"
					/>
					<input
						value={billingAddress}
						onChange={(e) => setBillingAddress(e.target.value)}
						placeholder="Billing Address"
						className="modal-input"
					/>
					<div style={{ margin: "1rem 0" }}>
						<input
							value={promoCode}
							onChange={(e) => setPromoCode(e.target.value)}
							placeholder="Promo Code"
							className="modal-input"
						/>
						<button
							type="button"
							onClick={handleApplyPromo}
							disabled={promoLoading}
							className="apply-promo-button">
							{promoLoading ? "Checking..." : "Apply"}
						</button>
						{promoStatus === "valid" && (
							<span className="promo-status success">Promo applied!</span>
						)}
						{promoStatus === "invalid" && (
							<span className="promo-status error">Invalid promo code</span>
						)}
					</div>
					{errorMsg && <div className="error-message">{errorMsg}</div>}
					<div className="modal-actions">
						<button
							type="button"
							className="confirm-button"
							onClick={handlePayment}
							disabled={orderLoading || !token}>
							{orderLoading ? "Processing..." : "Pay"}
						</button>
						<button type="button" className="cancel-button" onClick={onClose}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
