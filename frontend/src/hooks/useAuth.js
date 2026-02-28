import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Clean wrapper hook for consuming the Auth layer in UI components 
 * without repeatedly importing useContext and AuthContext.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider. Wrap your app root in <AuthProvider>.');
    }
    return context;
};
