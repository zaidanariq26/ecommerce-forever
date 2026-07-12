import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import useAuthStore from "../../zustand/authStore";

const ProtectedRoute = ({ children }) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

ProtectedRoute.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
