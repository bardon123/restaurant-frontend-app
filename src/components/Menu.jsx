import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useCart } from "../context/CartContext";
import CartModal from "./CartModal";
import "./Menu.css";

const GET_MENUS = gql`
	{
		menus {
			id
			label
			sections {
				id
				label
				items {
					id
					label
					price
					modifierGroups {
						id
						label
						modifiers {
							id
							label
							item {
								id
								label
								price
							}
						}
					}
				}
			}
		}
	}
`;

function Menu() {
	const { loading, error, data } = useQuery(GET_MENUS);
	const { openAddToCartModal } = useCart();

	if (loading) return <div className="loading">Loading...</div>;
	if (error) return <div className="error">Error: {error.message}</div>;

	return (
		<div className="menu-container">
			{data.menus.map((menu) => (
				<div key={menu.id}>
					<h2 className="menu-title">{menu.label}</h2>
					{menu.sections.map((section) => (
						<div key={section.id} className="menu-section">
							<h3 className="section-title">{section.label}</h3>
							<ul className="menu-items">
								{section.items.map((item) => (
									<li key={item.id} className="menu-item">
										<div className="item-details">
											<div className="item-header">
												<span className="item-label">{item.label}</span>
												{item.price > 0 && (
													<span className="item-price">
														${item.price.toFixed(2)}
													</span>
												)}
											</div>
										</div>
										<button
											className="add-to-cart-button"
											onClick={() => openAddToCartModal(item)}>
											Add to Cart
										</button>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			))}
			<CartModal />
		</div>
	);
}

export default Menu;
