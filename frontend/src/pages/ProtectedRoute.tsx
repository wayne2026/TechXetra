import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
	children,
	user,
}: {
	children: JSX.Element;
	user: any;
}) => {
	if (!user) {
		return <Navigate to="/" />;
	}
	return children;
};
export default ProtectedRoute;
