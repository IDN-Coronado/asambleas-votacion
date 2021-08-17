import './Hero.css';

const HomePage = ({ title, subtitle }) => {
	return <div className="hero-wrapper">
		<div className="container">
			<div className="hero is-halfheight">
				<div className="hero-body">
					<div className="hero-heading">
						<h1 className="title has-text-white">{title}</h1>
						<div className="subtitle is-4 has-text-white">{subtitle}</div>
					</div>
				</div>
			</div>
		</div>
	</div>;
}

export default HomePage;