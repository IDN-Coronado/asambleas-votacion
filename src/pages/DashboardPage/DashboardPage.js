import { useAuth } from '../../hooks/useAuth';

const DashboardPage = () => {
	let auth = useAuth();
	return <h3>{`Hello ${auth.user.email}`}</h3>;
}

export default DashboardPage;