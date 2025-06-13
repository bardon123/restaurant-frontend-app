import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store";
import "./AuthForm.css";

const LOGIN_MUTATION = gql`
	mutation LoginUser($input: LoginUserInput!) {
		loginUser(input: $input) {
			user {
				id
				email
			}
			token
			client
			uid
			errors
		}
	}
`;

export default function LoginForm({ onSuccess }) {
	const dispatch = useDispatch();
	const [form, setForm] = useState({ email: "", password: "" });
	const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION, {
		onCompleted: (data) => {
			console.log("Login mutation completed:", data);
			const res = data.loginUser;
			if (res && res.token && res.client && res.uid) {
				dispatch(
					loginAction({
						token: res.token,
						client: res.client,
						uid: res.uid,
						user: res.user,
					})
				);
				if (onSuccess) onSuccess();
			}
		},
	});

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation({ variables: { input: form } });
	};

	return (
		<form className="auth-form" onSubmit={handleSubmit}>
			<h2 className="auth-title">Login</h2>
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
				autoComplete="current-password"
			/>
			<button className="auth-button" type="submit" disabled={loading}>
				Login
			</button>
			{error && <div className="auth-error">{error.message}</div>}
		</form>
	);
}
