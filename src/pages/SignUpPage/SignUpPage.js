import { useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

import errorMappings from '../../utils/errorMappings';

const SignUpPage = () => {
	const history = useHistory();
	const location = useLocation();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [displayName, setdisplayName] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');
	const [confirmationError, setConfirmationError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const auth = useAuth();

	const { from } = location.state || { from: { pathname: "/" } };

	const onEmailChange = e => {
		setEmail(e.currentTarget.value);
	}

	const onPasswordChange = e => {
		const pass = e.currentTarget.value;
		setPassword(pass);
		setConfirmationError(pass !== passwordConfirmation);
	}

	const onDisplayNameChange = e => {
		setdisplayName(e.currentTarget.value);
	}

	const onPasswordConfirmationChange = e => {
		const passConfirmation = e.currentTarget.value;
		setPasswordConfirmation(passConfirmation);
		setConfirmationError(passConfirmation !== password);
	}

	const clearForm = () => {
		setEmail('');
		setPassword('');
	}

	const validate = () => {
		if (displayName && email && password) return true
		return false
	}

	const signup = () => {
		if (!validate()) return;
		setLoading(true);
		auth.signup(displayName, email, password)
			.then(() => {
				clearForm();
				setLoading(false);
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
				<div className="column is-offset-2 is-8">
					<div className="block">
						<h1 className="title">Registro</h1>
						<p className="subtitle is-6">Regístrate con tu email</p>
					</div>
					<div className="block">
						{error && <div className="message is-danger">
							<div className="message-body">{errorMappings[error]}</div>
						</div>}
					</div>
				</div>
			</div>
			<div className="columns">
				<div className="column is-8 is-offset-2">
					<div className="block">
						<div className="field">
							<label className="label">Nombre</label>
							<div className="control">
								<input
									className="input"
									type="text"
									placeholder="Nombre"
									value={displayName}
									onChange={onDisplayNameChange}
								/>
							</div>
						</div>
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
						<div className="field">
							<label className="label">Confirmar Contraseña</label>
							<div className="control">
								<input
									className={`input${confirmationError ? ' is-danger' : ''}`}
									type="password"
									placeholder="Password"
									value={passwordConfirmation}
									onChange={onPasswordConfirmationChange}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="columns">
				<div className="column is-8 is-offset-2">
					<div className="block">
						<button
							className={`button${loading ? ' is-loading' : ''}`}
							onClick={signup}
							{...(loading || confirmationError ? { disabled: true } : {})}
						>Registrarse</button>
					</div>
					<div className="block">
						<p>¿Ya tienes una cuenta? <Link to="acceso">Ingresa acá</Link></p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SignUpPage;