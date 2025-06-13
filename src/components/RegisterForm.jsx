import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store";
import "./AuthForm.css";

const REGISTER_USER_MUTATION = gql`
	mutation RegisterUser(
		$email: String!
		$password: String!
		$passwordConfirmation: String!
	) {
		registerUser(
			input: {
				email: $email
				password: $password
				passwordConfirmation: $passwordConfirmation
			}
		) {
			user {
				id
				email
			}
			token
			client
			uid
		}
	}
`;

export default function RegisterForm({ onSuccess }) {
	const dispatch = useDispatch();
	const [form, setForm] = useState({
		email: "",
		password: "",
		passwordConfirmation: "",
	});
	const [registerUser, { loading, error, data }] = useMutation(
		REGISTER_USER_MUTATION,
		{
			onCompleted: (data) => {
				if (data.registerUser) {
					dispatch(
						loginAction({
							token: data.registerUser.token,
							client: data.registerUser.client,
							uid: data.registerUser.uid,
							user: data.registerUser.user,
						})
					);
					if (onSuccess) onSuccess();
				}
			},
		}
	);

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = (e) => {
		e.preventDefault();
		registerUser({ variables: form });
	};

	return (
		<form className="auth-form" onSubmit={handleSubmit}>
			<h2 className="auth-title">Register</h2>
			<input
				className="auth-input"
				name="email"
				value={form.email}
				onChange={handleChange}
				placeholder="Email"
				required
				autoComplete="username"
			/>
			<input
				className="auth-input"
				name="password"
				type="password"
				value={form.password}
				onChange={handleChange}
				placeholder="Password"
				required
				autoComplete="new-password"
			/>
			<input
				className="auth-input"
				name="passwordConfirmation"
				type="password"
				value={form.passwordConfirmation}
				onChange={handleChange}
				placeholder="Confirm Password"
				required
				autoComplete="new-password"
			/>
			<button className="auth-button" type="submit" disabled={loading}>
				Register
			</button>
			{error && <div className="auth-error">{error.message}</div>}
			{data && <div className="auth-success">Registration successful!</div>}
		</form>
	);
}
