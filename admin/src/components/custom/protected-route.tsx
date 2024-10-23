import { ReactElement } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

interface Props {
    children?: ReactElement;
    isAuthenticated: boolean;
    redirect: string;
}

const ProtectedRoute = ({
    isAuthenticated,
    children,
    redirect,
}: Props) => {

    let location = useLocation();

    if (!isAuthenticated) return <Navigate to={redirect} state={{ from: location }} replace />;

    return children ? children : <Outlet />;
}

export default ProtectedRoute;