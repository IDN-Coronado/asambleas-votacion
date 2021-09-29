import Hero from '../../components/Hero/Hero';
import { useAuth } from '../../hooks/useAuth';

const HomePage = () => {
	const auth = useAuth();
	return <>
		<Hero title="Asamblea Online" subtitle="Maneja tus asambleas desde un solo lugar" />
		<div className="container">
			{!auth.user.church && <div className="columns mt-2">
				<div className="column is-12">
					<p className="subtitle">Por favor, contacta al encargado de tu iglesia para que puedas manejar asambleas de la misma.</p>
				</div>
			</div>}
		</div>
	</>;
}

export default HomePage;