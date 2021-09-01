import React, { Fragment, useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { useAuth } from '../../hooks/useAuth';

import './Nav.css';

const Nav = () => {
	const auth = useAuth()
	const location = useLocation();
	const [isActive, setIsActive] = useState(false);

	const onSignOut = () => {
		auth.signout()
	}

	const onHamburguerClick = () => {
		setIsActive(!isActive);
	}

	useEffect(() => {
		setIsActive(false);
    document.querySelector('body').classList.remove('headless');
	}, [location])

	return <nav className="navbar is-dark navbar is-fixed-top" role="navigation" aria-label="main navigation">
		<div className="container">
			<div className="navbar-brand">
				<Link className="navbar-item" to="/">
					<h1 className="title is-6 has-text-light">ASAMBLEAS ONLINE</h1>
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
			{auth.user && <div className="navbar-start">
					<NavLink className="navbar-item" to="/asambleas">Asambleas</NavLink>
					<NavLink className="navbar-item" to="/miembros">Miembros</NavLink>
					<hr className="dropdown-divider is-hidden-desktop" />
					<NavLink className="navbar-item is-hidden-desktop" to="/perfil">Perfil</NavLink>
					<hr className="dropdown-divider is-hidden-desktop" />
				</div>}

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
							</Fragment> : <div>
								<button className="button is-primary is-hidden-desktop" onClick={onSignOut}>Salir</button>
								<div className="profile dropdown is-right is-hoverable is-hidden-mobile is-hidden-tablet-only">
									<div className="dropdown-trigger">
										<button className="button has-text-light" aria-haspopup="true" aria-controls="dropdown-menu4">
											<div className="profile-info is-flex is-flex-direction-column is-align-items-flex-end">
												<span className="profile-name has-text-weight-semibold is-size-6">{auth.user.displayName}</span>
												<span className="profile-church has-text-weight-light is-size-7 is-uppercase">{auth.church && auth.church.name}</span>
											</div>
											<span className="icon is-large">
												<i className="far fa-user-circle" aria-hidden="true"></i>
											</span>
										</button>
									</div>
									<div className="dropdown-menu" id="dropdown-menu4" role="menu">
									<div className="dropdown-content">
										<Link to="/perfil" className="dropdown-item is-primary">
											Perfil
										</Link>
										<hr className="dropdown-divider" />
										<button type="button" className="dropdown-item is-primary" onClick={onSignOut}>
											Salir
										</button>
									</div>
									</div>
								</div>
							</div>}
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
};

export default Nav;