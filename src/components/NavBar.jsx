import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, clearCart } from "../store";
import "./NavBar.css";

export default function NavBar({ onShowLogin, onShowRegister }) {
	const token = useSelector((state) => state.auth.token);
	const dispatch = useDispatch();

	const handleLogout = () => {
		dispatch(logout());
		dispatch(clearCart());
	};

	return (
		<nav className="nav-bar">
			<div className="nav-title">Restaurant App</div>
			<div className="nav-links">
				{!token ? (
					<>
						<button className="nav-link" onClick={onShowLogin}>
							Login
						</button>
						<button className="nav-link" onClick={onShowRegister}>
							Register
						</button>
					</>
				) : (
					<button className="nav-link" onClick={handleLogout}>
						Logout
					</button>
				)}
			</div>
		</nav>
	);
}
