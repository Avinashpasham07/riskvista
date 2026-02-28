import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import GlassCard from '../components/GlassCard';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setIsSubmitting(false);
    };

    return (
        <GlassCard>
            <div className="text-center mb-8">
                <div className="inline-flex justify-center items-center w-12 h-12 rounded-xl bg-brand-blue/20 border border-brand-blue/30 mb-4">
                    <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">Sign in to Platform</h1>
                <p className="text-zinc-400 text-sm mt-2">Enter your corporate credentials to access intelligence.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">Work Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="glass-input"
                        placeholder="founder@startup.com"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="glass-input"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full primary-btn mt-2 flex justify-center items-center disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Sign In'}
                </button>
            </form>

            <p className="text-center text-zinc-400 text-sm mt-6">
                Don't have an account? <Link to="/register" className="text-brand-blue hover:text-blue-400 font-medium transition-colors">Create entity</Link>
            </p>
        </GlassCard>
    );
};

export default Login;
