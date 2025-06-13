import React from "react";
import { ApolloProvider } from "@apollo/client";
import { useSelector } from "react-redux";
import Menu from "./components/Menu";
import CartPreview from "./components/CartPreview";
import CartItemsModal from "./components/CartItemsModal";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import "./App.css";
import client from "./apollo-client";

function App() {
	const [showLogin, setShowLogin] = React.useState(false);
	const [showRegister, setShowRegister] = React.useState(false);
	const [isCartModalOpen, setIsCartModalOpen] = React.useState(false);
	const token = useSelector((state) => state.auth.token);

	React.useEffect(() => {
		if (token && (showLogin || showRegister)) {
			setShowLogin(false);
			setShowRegister(false);
		}
	}, [token, showLogin, showRegister]);

	const handleOpenCartModal = () => setIsCartModalOpen(true);
	const handleCloseCartModal = () => setIsCartModalOpen(false);

	return (
		<ApolloProvider client={client}>
			<div className="App">
				<NavBar
					onShowLogin={() => {
						setShowLogin(true);
						setShowRegister(false);
					}}
					onShowRegister={() => {
						setShowRegister(true);
						setShowLogin(false);
					}}
				/>
				<Menu />
				<CartPreview onOpenCartModal={handleOpenCartModal} />
				<CartItemsModal
					isCartModalOpen={isCartModalOpen}
					onCloseCartModal={handleCloseCartModal}
				/>
				{/* Auth Modal */}
				{(showLogin || showRegister) && (
					<div className="modal-overlay">
						<div className="modal-content" style={{ maxWidth: 400 }}>
							<button
								className="cancel-button"
								style={{ float: "right", marginBottom: "1rem" }}
								onClick={() => {
									setShowLogin(false);
									setShowRegister(false);
								}}>
								Close
							</button>
							{showLogin && <LoginForm />}
							{showRegister && (
								<RegisterForm
									onSuccess={() => {
										setShowRegister(false);
										setShowLogin(false);
									}}
								/>
							)}
						</div>
					</div>
				)}
			</div>
		</ApolloProvider>
	);
}

export default App;
