import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from '../../hooks/useAuth';

const Nav = () => {
	const auth = useAuth()
	const [isActive, setIsActive] = useState(false);

	const onSignOut = () => {
		auth.signout()
	}

	const onHamburguerClick = () => {
		setIsActive(!isActive);
	}

	return <nav className="navbar is-dark navbar is-fixed-top" role="navigation" aria-label="main navigation">
		<div className="container">
			<div className="navbar-brand">
				<Link className="navbar-item" to="/">
					<h1 className="title is-6 has-text-light">ASAMBLEAS MANAGER</h1>
				</Link>

				<button
					className={`navbar-burger${isActive ? ' is-active' : ''}`}
					aria-label="menu"
					aria-expanded={isActive ? 'true' : 'false'}
					data-target="navbarBasicExample"
					onClick={onHamburguerClick}
				>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</button>
			</div>
			<div id="navbarBasicExample" className={`navbar-menu${isActive ? ' is-active' : ''}`}>
				<div className="navbar-start">
					<Link className="navbar-item" to="/asambleas">Asambleas</Link>
					<Link className="navbar-item" to="/miembros">Miembros</Link>
				</div>

				<div className="navbar-end">
					<div className="navbar-item">
						<div className="buttons">
							{!auth.user ? <Fragment>
								<Link className="button is-primary" to="/registro">
									<strong>Registrarse</strong>
								</Link>
								<Link className="button is-light" to="/acceso">
									Acceder
								</Link>
							</Fragment> : <button className="button is-primary" onClick={onSignOut}>Salir</button>}
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
};

export default Nav;