import { useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

import errorMappings from '../../utils/errorMappings';

import './LoginPage.css';

const LoginPage = () => {
	const history = useHistory();
	const location = useLocation();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const auth = useAuth();

	const { from } = location.state || { from: { pathname: "/" } };

	const onEmailChange = e => {
		setEmail(e.currentTarget.value);
	}

	const onPasswordChange = e => {
		setPassword(e.currentTarget.value);
	}

	const clearForm = () => {
		setEmail('');
		setPassword('');
	}

	const login = () => {
		setLoading(true);
		auth.signin(email, password)
			.then(user => {
				setLoading(false);
				clearForm();
				history.replace(from);
			})
			.catch(error => {
				setLoading(false);
				setError(error.code)
			})
	};

	return (
		<div className="identity-form">
			<div className="columns">
				<div className="column is-8 is-offset-2">
					<div className="block">
						<h1 className="title">Ingresa</h1>
						<p className="subtitle is-6">Ingresa al sition con tu email</p>
					</div>
					<div className="block">
						{error && <div className="message is-danger">
							<div className="message-body">{errorMappings[error]}</div>
						</div>}
					</div>
					<div className="block">
						<div className="field">
							<label className="label">Email</label>
							<div className="control">
								<input
									className="input"
									type="email"
									placeholder="Email"
									value={email}
									onChange={onEmailChange}
								/>
							</div>
						</div>
					</div>
					<div className="block">
						<div className="field">
							<label className="label">Contraseña</label>
							<div className="control">
								<input
									className="input"
									type="password"
									placeholder="Password"
									value={password}
									onChange={onPasswordChange}
								/>
							</div>
						</div>
					</div>
					<div className="block">
						<button
							className={`button${loading ? ' is-loading' : ''}`}
							onClick={login}
							{...(!(email && password) || loading ? { disabled: true } : {})}
						>Ingresar</button>
					</div>
					<div className="block">
						<p>¿No tienes una cuenta? <Link to="registro">Registrate</Link></p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;