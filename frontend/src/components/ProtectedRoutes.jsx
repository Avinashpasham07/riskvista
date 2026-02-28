import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Higher Order Component to protect Dashboard Routes.
 * If there is no token/user, forces the user back to the login screen.
 */
const ProtectedRoutes = () => {
    const { token, loading } = useAuth();

    // Prevent flashing the login screen while the context is checking localStorage
    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
